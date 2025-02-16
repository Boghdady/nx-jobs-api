import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.job';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { LoadProductsJob } from './jobs/products/load-products.job';

@Module({
  imports: [DiscoveryModule],
  providers: [FibonacciJob, LoadProductsJob, JobsService, JobsResolver],
})
export class JobsModule {}
