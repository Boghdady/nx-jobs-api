import {
  DiscoveredClassWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { IJobMetadata } from './interfaces/job-metadata.interface';
import { JOB_METADATA_KEY } from './decorators/job.decorator';

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
}
