import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.job';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { LoadProductsJob } from './jobs/products/load-products.job';
import { AUTH_PACKAGE_NAME } from '@jobs-system/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PulsarModule } from '@jobs-system/pulsar';

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../../libs/grpc/proto/auth.proto'),
        },
      },
    ]),
  ],
  providers: [FibonacciJob, LoadProductsJob, JobsService, JobsResolver],
})
export class JobsModule {}
