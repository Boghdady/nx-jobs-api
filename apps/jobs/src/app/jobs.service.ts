import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { IJobMetadata } from './interfaces/job-metadata.interface';
import { JOB_METADATA_KEY } from './decorators/job.decorator';
import { AbstractJobs } from './jobs/abstract-jobs';

@Injectable()
export class JobsService implements OnModuleInit {
  private jobs: DiscoveredClassWithMeta<IJobMetadata>[] = [];

  constructor(private readonly discoveryService: DiscoveryService) {}

  async onModuleInit() {
    this.jobs =
      await this.discoveryService.providersWithMetaAtKey<IJobMetadata>(
        JOB_METADATA_KEY
      );
  }

  getJobsMetadata() {
    return this.jobs.map((job) => job.meta);
  }

  async executeJob(name: string) {
    const job = this.jobs.find((job) => job.meta.name === name);
    if (!job) {
      throw new BadRequestException(`Job with name ${name} not found`);
    }

    if (!(job.discoveredClass.instance instanceof AbstractJobs)) {
      throw new BadRequestException(
        `Job with name ${name} is not an instance of AbstractJobs`
      );
    }

    await job.discoveredClass.instance.execute({}, job.meta.name);

    return job.meta;
  }
}
