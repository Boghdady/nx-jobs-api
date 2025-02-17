import { PulsarClient } from '@jobs-system/pulsar';
import { AbstractJobs } from '../abstract-jobs';
import { Job } from '../../decorators/job.decorator';
import { IProductData } from './product-data.interface';

@Job({
  name: 'load-products',
  description: 'Loads uploaded product data into the DB after enrichment.',
})
export class LoadProductsJob extends AbstractJobs<IProductData> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
