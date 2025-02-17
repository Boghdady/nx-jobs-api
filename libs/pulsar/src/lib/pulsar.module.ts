import { Module } from '@nestjs/common';
import { PulsarClient } from './pulsar.client';

@Module({
  providers: [PulsarClient],
  exports: [PulsarClient],
})
export class PulsarModule {}
