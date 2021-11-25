import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';
import { NestExpressApplication} from '@nestjs/platform-express';
import { join } from 'path'
import { Logger } from '@nestjs/common';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});
  app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(5000);
}
bootstrap();
