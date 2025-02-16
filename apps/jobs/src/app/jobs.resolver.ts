import { Query, Resolver } from '@nestjs/graphql';
import { JobsService } from './jobs.service';
import { JobMetadata } from './models/job-metadata.model';
import { GqlAuthGuard } from '@jobs-system/nestjs';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [JobMetadata], { name: 'jobsMetadata' })
  getJobsMetadata() {
    return this.jobsService.getJobsMetadata();
  }
}
