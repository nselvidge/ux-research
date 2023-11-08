import { Settings } from "@root/global/Settings";
import { connect, Connection, Channel } from "amqplib";
import pino from "pino";
import { inject, singleton } from "tsyringe";
import cron from "node-cron";
import { captureException } from "@sentry/node";

@singleton()
export class AMQPPubSub {
  private connection?: Connection;
  private publishChannel?: Channel;
  constructor(
    private settings: Settings,
    @inject("Logger") private logger: pino.Logger
  ) {}
  getConnection = async (): Promise<Connection> => {
    if (!this.connection) {
      this.logger.info("Creating new AMQP connection");
      this.connection = await connect(this.settings.getSetting("amqpUrl"));
      this.connection.on("error", (err) => {
        this.logger.error("AMQP connection error", err);
        captureException(err);
      });
    }

    return this.connection;
  };

  getSubscribeChannel = async (queue: string) => {
    const conn = await this.getConnection();

    const channel = await conn.createChannel();
    await channel.assertQueue(queue);

    return channel;
  };

  getPublishChannel = async (queue: string) => {
    const conn = await this.getConnection();
    if (!this.publishChannel) {
      this.publishChannel = await conn.createChannel();
    }

    await this.publishChannel.assertQueue(queue);

    return this.publishChannel;
  };

  publishOnInterval = async (
    event: string,
    message: unknown,
    interval: string
  ) => {
    // Publish specified message to specified event on specified interval
    cron.schedule(interval, async () => {
      this.publish(event, message);
    });
  };

  subscribe = async (
    event: string,
    fn: (message: unknown) => Promise<void>
  ) => {
    const channel = await this.getSubscribeChannel(event);
    channel.on("error", (err) =>
      this.logger.error("error in channel " + event, err)
    );
    channel.consume(event, async (message) => {
      if (!message) {
        this.logger.error("invalid message sent to " + event, {
          invalidMessage: JSON.stringify(message),
        });
        return;
      }
      this.logger.info("received message from " + event);
      try {
        const parsedMessage = JSON.parse(message.content.toString());

        await fn(parsedMessage);
        channel.ack(message);
        this.logger.info("processed message from " + event);
      } catch (err) {
        this.logger.error(`Error processing message ${event}: `, err);
        captureException(err);
        channel.nack(message, false, false);
      }
    });
    this.logger.info("subscribed to " + event);
  };

  publish = async (event: string, message: unknown) => {
    this.logger.info("publishing to " + event);
    const channel = await this.getPublishChannel(event);

    channel.sendToQueue(event, Buffer.from(JSON.stringify(message)));
  };
}
