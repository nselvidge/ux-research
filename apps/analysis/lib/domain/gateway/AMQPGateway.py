"""AMQP Gateway"""
import json
import logging
from typing import List
import pika
from lib.domain.interactors.reader import ReaderInteractor, \
    ExtractedQuoteMessage, TagDescriptionMessage
from lib.shared.container import Container
from ..interactors.serializers.document_serializer import \
    GatewayInterviewDocument


SUMMARY_READY = 'SUMMARY_READY'
EXTRACTED_QUOTES_READY = 'EXTRACTED_QUOTES_READY'

container = Container()

logger = logging.getLogger(__name__)


class AMQPGateway:
    """AMQP Gateway"""

    def __init__(self, amqp_url: str):
        self.amqp_url = amqp_url

    def get_ensured_channel(self):
        """Ensure that the connection is open"""
        parameters = "heartbeat=600&blocked_connection_timeout=300"
        connection_string = "{}&{}".format(
            self.amqp_url, parameters) if "?" in self.amqp_url \
            else "{}?{}".format(self.amqp_url, parameters)

        connection = pika.BlockingConnection(
            pika.URLParameters(connection_string))

        channel = connection.channel()

        return connection, channel

    def publish_summary_ready(self, summary: str, document_id: str):
        """Publish a summary ready event"""
        logger.info("Publishing summary ready event")
        connection, channel = self.get_ensured_channel()

        channel.queue_declare(queue=SUMMARY_READY, durable=True)
        channel.basic_publish(exchange='',
                              routing_key=SUMMARY_READY,
                              body=json.dumps({'summary': summary,
                                               'documentId': document_id}))
        connection.close()

    def publish_extracted_quotes_ready(self,
                                       quotes: List[ExtractedQuoteMessage],
                                       document_id: str):
        """Publish an extracted quotes ready event"""
        logger.info("Publishing extracted quotes ready event")
        connection, channel = self.get_ensured_channel()

        channel.queue_declare(queue=EXTRACTED_QUOTES_READY, durable=True)
        channel.basic_publish(exchange='',
                              routing_key=EXTRACTED_QUOTES_READY,
                              body=json.dumps({'quotes': [quote._asdict() for
                                                          quote in quotes],
                                               'documentId': document_id}))
        connection.close()

    def on_interview_ready(self, message: bytes):
        """Subscribe to interview ready events"""
        logger.info("Received interview ready event")
        data = json.loads(message)

        if data['text'] is None:
            raise ValueError("Invalid message received. Text is null")

        if data['documentId'] is None:
            raise ValueError("Invalid message received. DocumentId is null")

        document_id = data['documentId']

        if data['text'] == '':
            # publish an empty summary if there is no text
            logger.info(
                "Publishing empty summary for document_id: %s", document_id)
            self.publish_summary_ready("", document_id)
            return

        document = GatewayInterviewDocument(data['text'], None, [])

        reader = ReaderInteractor(container.summarization_service())
        result = reader.summarize_interview(document)
        logger.info("Summary: %s", result)
        self.publish_summary_ready(result, document_id)

    def on_extract_quotes(self, message: bytes):
        """Subscribe to extracted quote events"""
        logger.info("Received extracted quote event")
        data = json.loads(message)

        if data['text'] is None:
            raise ValueError("Invalid message received. Text is null")

        if data['documentId'] is None:
            raise ValueError("Invalid message received. DocumentId is null")

        if data['tags'] is None:
            raise ValueError("Invalid message received. Tags is null")

        if data['tags'] == []:
            logger.info("No tags provided. Skipping extraction")
            return

        if any(tag['id'] is None for tag in data['tags']):
            raise ValueError("Invalid message received. tag.id is null")

        tags = [TagDescriptionMessage(id=tag['id'],
                                      name=tag['name'],
                                      description=tag['description'])
                for tag in data['tags']]

        document_id = data['documentId']

        if data['text'] == '':
            # publish an empty summary if there is no text
            logger.info(
                "Publishing empty extracted quotes for document_id: %s",
                document_id)
            self.publish_extracted_quotes_ready([], document_id)
            return

        reader = ReaderInteractor(container.summarization_service())
        result = reader.extract_quotes(data['text'], tags)

        logger.info("extracted quote results: %s", result)

        self.publish_extracted_quotes_ready(result, document_id)
