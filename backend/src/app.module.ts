import { ChatModule } from './chat/chat.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/orm.config';
import { WSGame} from './game/ws-game.module';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { Connection } from 'typeorm';

@Module({
  imports: [ChatModule, WSGame, TypeOrmModule.forRoot(config), HttpModule, userModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
