import { PulsarClient } from '@jobs-system/pulsar';
import { AbstractJobs } from '../abstract-jobs';
import { Job } from '../../decorators/job.decorator';
import { ProductData } from './product-data.message';

@Job({
  name: 'load-products',
  description: 'Loads uploaded product data into the DB after enrichment.',
})
export class LoadProductsJob extends AbstractJobs<ProductData> {
  protected messageClass: new () => ProductData = ProductData;
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
