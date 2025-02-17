import { PulsarClient } from '@jobs-system/pulsar';
import { AbstractJobs } from '../abstract-jobs';
import { Job } from '../../decorators/job.decorator';
import { IFibonacciData } from './fobonacci-data.interface';

@Job({
  name: 'fibonacci',
  description: 'Generates a fibonacci sequence and store it in DB',
})
export class FibonacciJob extends AbstractJobs<IFibonacciData> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
