import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';
import { NestExpressApplication} from '@nestjs/platform-express';
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: true,
});
  await app.listen(667);
}
bootstrap();
