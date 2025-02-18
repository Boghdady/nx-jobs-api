import { PulsarClient } from '@jobs-system/pulsar';
import { AbstractJobs } from '../abstract-jobs';
import { Job } from '../../decorators/job.decorator';
import { FibonacciData } from './fobonacci-data.message';

@Job({
  name: 'fibonacci',
  description: 'Generates a fibonacci sequence and store it in DB',
})
export class FibonacciJob extends AbstractJobs<FibonacciData> {
  protected messageClass: new () => FibonacciData = FibonacciData;
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
