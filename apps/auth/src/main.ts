import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { init } from '@jobs-system/nestjs';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await init(app, 'auth');

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/auth.proto'),
    },
  });
  await app.startAllMicroservices();
}

bootstrap();
