import { Injectable, OnModuleInit } from '@nestjs/common';
import { AbstractPulsarConsumer, PulsarClient } from '@jobs-system/pulsar';
import { IFibonacciData } from './fibonacci-data.interface';
import { iterate } from 'fibonacci';

@Injectable()
export class FibonacciConsumer
  extends AbstractPulsarConsumer<IFibonacciData>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'fibonacci');
  }

  protected async onMessage(data: IFibonacciData): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(`Fibonacci result: ${result.number}`);
  }
}
