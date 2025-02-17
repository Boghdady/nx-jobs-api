import { Module } from '@nestjs/common';
import { JobsExecutorsModule } from './jobs/jobs-executors.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JobsExecutorsModule],
})
export class AppModule {}
