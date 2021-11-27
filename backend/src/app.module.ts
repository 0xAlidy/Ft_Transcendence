import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat/chat.gateway';
import { config } from './orm.config';
import { WsModule } from './ws/ws.module';
import { AppController } from './app.controller';
import { HttpModule} from '@nestjs/axios';
import { Connection } from 'typeorm';

@Module({
  imports: [WsModule, ChatGateway, HttpModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
