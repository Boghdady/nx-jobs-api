import { Injectable, OnModuleInit } from '@nestjs/common';
import { AbstractPulsarConsumer, PulsarClient } from '@jobs-system/pulsar';
import { Message } from 'pulsar-client';

@Injectable()
export class FibonacciConsumer
  extends AbstractPulsarConsumer
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'fibonacci');
  }

  protected async onMessage(message: Message): Promise<void> {
    // convert buffer to object
    console.log(JSON.parse(message.getData().toString()));

    await this.acknowledge(message);
  }
}
