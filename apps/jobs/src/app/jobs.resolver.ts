import { Query, Resolver } from '@nestjs/graphql';
import { JobsService } from './jobs.service';
import { JobMetadata } from './models/job-metadata.model';

@Resolver()
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  @Query(() => [JobMetadata], { name: 'jobsMetadata' })
  getJobsMetadata() {
    return this.jobsService.getJobsMetadata();
  }
}
