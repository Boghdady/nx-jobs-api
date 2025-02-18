import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobsService } from './jobs.service';
import { JobMetadata } from './models/job-metadata.model';
import { GqlAuthGuard } from '@jobs-system/nestjs';
import { UseGuards } from '@nestjs/common';
import { ExecuteJobInput } from './dto/execute-job.input';

@Resolver()
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  @Query(() => [JobMetadata], { name: 'jobsMetadata' })
  @UseGuards(GqlAuthGuard)
  getJobsMetadata() {
    return this.jobsService.getJobsMetadata();
  }

  @Mutation(() => JobMetadata)
  @UseGuards(GqlAuthGuard)
  async executeJob(@Args('executeJobInput') executeJobInput: ExecuteJobInput) {
    return this.jobsService.executeJob(
      executeJobInput.name,
      executeJobInput.data
    );
  }
}
