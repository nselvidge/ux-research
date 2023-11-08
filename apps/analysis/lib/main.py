"""Entrypoint for the analysis worker"""
import os
from threading import Thread
import time
import logging
import logging.config
import pika
import pika.channel
import pika.spec
import signal
import sentry_sdk
import json

from lib.shared.container import Container
from lib.domain.gateway.AMQPGateway import AMQPGateway

container = Container()

env = os.environ.get("NODE_ENV", "development")

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'logzioFormat': {
            'format': json.dumps({
                'environment': env, }),
            'validate': False
        },
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'INFO',
            'formatter': 'standard',
            'stream': 'ext://sys.stdout'},
        'logzio': {
            'class': 'logzio.handler.LogzioHandler',
            'level': 'INFO',
            'formatter': 'logzioFormat',
            'token': 'wYAtbPzInsvLswUhoPMJxMmgLeZwnvMu',
            'logzio_type': 'python',
            'logs_drain_timeout': 5,
            'url': 'https://listener.logz.io:8071',
            'add_context': True
        }
    },
    'loggers': {
        '': {
            'level': 'DEBUG',
            'handlers': ['logzio', 'console'],
            'propagate': True
        }
    }
}


if env == "development":
    logging.basicConfig(level=logging.INFO)
else:
    logging.config.dictConfig(LOGGING)

logger = logging.getLogger()

GENERATE_SUMMARY_QUEUE = "GENERATE_SUMMARY"
EXTRACT_QUOTES_QUEUE = "EXTRACT_QUOTES"

sentry_sdk.init(
    dsn="https://f120fc1f9d834530befef36dc93a3f3d@o4504181711765504.ingest.sentry.io/4504958012489728",
    environment=os.environ.get("NODE_ENV", "development"),
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0
)


class Consumer:
    """Consumer to handle messages from the queue"""

    def __init__(self):
        self.amqp_url = os.environ.get(
            "CLOUDAMQP_URL") or 'amqp://localhost:5672'
        self.parameters = pika.URLParameters(self.amqp_url)
        self.connection = pika.SelectConnection(
            parameters=self.parameters, on_open_callback=self.on_open)
        self.should_reconnect = False
        self.connection.add_on_close_callback(self.on_connection_closed)
        self.connection.add_on_open_error_callback(
            self.on_connection_open_error)

    def run(self):
        "Run the consumer"

        self.connection.ioloop.start()

    def stop(self):
        """Stop the consumer"""

        if self.connection.is_closing or self.connection.is_closed:
            logger.info('Connection is closing or already closed')
        else:
            logger.info('Closing connection')
            self.connection.close()

    def on_open(self, open_connection: pika.SelectConnection):
        """Called when the connection is open"""
        gateway = AMQPGateway(self.amqp_url)

        open_connection.channel(on_open_callback=self.create_on_channel_open(
            GENERATE_SUMMARY_QUEUE, gateway.on_interview_ready))
        open_connection.channel(on_open_callback=self.create_on_channel_open(
            EXTRACT_QUOTES_QUEUE, gateway.on_extract_quotes))

    def create_on_message(self, queue: str, callback: callable):
        def on_message(channel: pika.channel.Channel,
                       method_frame: pika.spec.Basic.Deliver,
                       header_frame: pika.BasicProperties, message: bytes):
            """Called when a message is received"""
            logger.info("Received message for queue %s", queue)

            try:
                Thread(target=callback, args=(message,)).start()
                channel.basic_ack(delivery_tag=method_frame.delivery_tag)
            except BaseException:
                logger.exception("Error processing message")
                channel.basic_nack(
                    delivery_tag=method_frame.delivery_tag, requeue=False)
                return
        return on_message

    def create_on_queue_declared(self, channel: pika.channel.Channel,
                                 queue: str, callback: callable):
        """Called when the queue is declared"""
        def on_queue_declared(_unused_frame):
            logger.info("consuming queue %s", queue)
            channel.basic_qos(prefetch_count=1)
            channel.add_on_close_callback(self.on_channel_closed)
            channel.basic_consume(queue=queue,
                                  on_message_callback=self.create_on_message(
                                      queue, callback))
        return on_queue_declared

    def create_on_channel_open(self, queue: str, callback: callable):
        """Called when the channel is open"""
        def on_channel_open(channel: pika.channel.Channel):
            logger.info("declaring queue %s", queue)
            channel.queue_declare(queue=queue,
                                  durable=True,
                                  callback=self
                                  .create_on_queue_declared(channel,
                                                            queue,
                                                            callback))
        return on_channel_open

    def reconnect(self):
        """Will be invoked if the connection can't be opened or is
        closed. Indicates that a reconnect is necessary then stops the
        ioloop.
        """
        self.should_reconnect = True
        self.stop()

    def on_connection_open_error(self, _unused_connection, err: BaseException):
        """This method is called by pika if the connection to RabbitMQ
        can't be established.
        """
        logger.error("Connection open failed: %s", err)
        self.reconnect()

    def on_channel_closed(self, channel: pika.channel.Channel,
                          reason: BaseException):
        """This method is invoked by pika when the channel is closed.
        Channels are usually closed if you attempt to do something that
        violates the protocol, such as re-declare an exchange or queue with
        different parameters. In this case, we'll close the connection
        to shutdown the object.
        """
        logger.warning("Channel %i was closed: %s", channel, reason)
        self.reconnect()

    def on_connection_closed(self, _unused_connection, reason: BaseException):
        """This method is invoked by pika when the connection to RabbitMQ is
        closed unexpectedly. Since it is unexpected, we will reconnect to
        RabbitMQ if it disconnects.
        """
        logger.warning("Connection closed: %s", reason)
        self.reconnect()


class GracefulKiller:
    kill_now = False

    def __init__(self):
        signal.signal(signal.SIGINT, self.exit_gracefully)
        signal.signal(signal.SIGTERM, self.exit_gracefully)

    def exit_gracefully(self, *args):
        self.kill_now = True


class ReconnectingConsumer:
    """This is an example consumer that will reconnect if the nested
    ExampleConsumer indicates that a reconnect is necessary.
    """

    def __init__(self):
        self._reconnect_delay = 0
        self._consumer = Consumer()

    def run(self):
        """Run the consumer"""
        killer = GracefulKiller()
        while killer.kill_now is False:
            try:
                logger.info("Starting consumer")
                self._consumer.run()
            except (KeyboardInterrupt, SystemExit):
                self._consumer.stop()
                break
            self._maybe_reconnect()

    def _maybe_reconnect(self):
        if self._consumer.should_reconnect:
            logger.info("Restarting consumer")
            self._consumer.stop()
            reconnect_delay = self._get_reconnect_delay()
            time.sleep(reconnect_delay)
            self._consumer = Consumer()

    def _get_reconnect_delay(self):
        self._reconnect_delay += 1
        if self._reconnect_delay > 30:
            self._reconnect_delay = 30
        return self._reconnect_delay


def main():
    """Main entrypoint"""
    consumer = ReconnectingConsumer()
    consumer.run()
    logger.info("Exiting consumer")


main()
