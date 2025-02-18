/*
 * Jobs module act as a gateway to produce messages to the apache pulsar, this give use
 * the ability to scale horizantly by increasing the number of consumers instances
 */
import { PulsarClient, serialize } from '@jobs-system/pulsar';
import { Producer } from 'pulsar-client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export abstract class AbstractJobs<T extends object> {
  private producer: Producer;
  // messageClass refere the class dto that contains the validation for inputs
  protected abstract messageClass: new () => T;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async execute(data: T | T[], job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }

    if (Array.isArray(data)) {
      for (const item of data) {
        await this.validateData(item);
        await this.send(item);
      }
    } else {
      await this.validateData(data);
      await this.send(data);
    }
  }

  private async send(data: T) {
    await this.producer.send({
      data: serialize(data),
    });
  }

  private async validateData(data: T) {
    const errors = await validate(plainToInstance(this.messageClass, data));
    if (errors.length) {
      throw new BadRequestException(
        `Job data is invalid: ${JSON.stringify(errors)}`
      );
    }
  }
}
