/*
 * Jobs module act as a gateway to produce messages to the apache pulsar, this give use
 * the ability to scale horizantly by increasing the number of consumers instances
 */
import { PulsarClient } from '@jobs-system/pulsar';
import { Producer } from 'pulsar-client';

export abstract class AbstractJobs<T> {
  private producer: Producer;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async execute(data: T, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }

    await this.producer.send({
      data: Buffer.from(JSON.stringify(data)),
    });
  }
}
