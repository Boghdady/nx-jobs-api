import { Consumer, Message } from 'pulsar-client';
import { PulsarClient } from './pulsar.client';
import { deserialize } from './serialize';
import { Logger } from '@nestjs/common';

export abstract class AbstractPulsarConsumer<T> {
  private consumer!: Consumer;
  protected readonly logger = new Logger(this.topic);

  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly topic: string
  ) {}

  async onModuleInit() {
    this.consumer = await this.pulsarClient.createConsumer(
      this.topic,
      this.listener.bind(this)
    );
  }

  private async listener(message: Message) {
    try {
      const data = deserialize<T>(message.getData());
      this.logger.debug(`Recieved message: ${JSON.stringify(data)}`);
      await this.onMessage(data);
    } catch (error) {
      this.logger.error(error);
    } finally {
      // we acknowledge the message to make sure we are free up the consumer
      // we can use retry letter queue with dead letter queue
      await this.consumer.acknowledge(message);
    }
  }

  protected abstract onMessage(data: T): Promise<void>;
}
