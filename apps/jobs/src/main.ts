import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { init } from '@jobs-system/nestjs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await init(app, 'jobs');
}

bootstrap();
