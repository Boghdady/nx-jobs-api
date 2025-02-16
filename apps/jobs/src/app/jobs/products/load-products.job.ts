import { Job } from '../../decorators/job.decorator';

@Job({
  name: 'load-products',
  description: 'Loads uploaded product data into the DB after enrichment.',
})
export class LoadProductsJob {}
