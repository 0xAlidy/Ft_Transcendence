import { ChatModule } from './chat/chat.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WSGame} from './game/ws-game.module';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { Connection } from 'typeorm';
import {UsersModule} from './user/user.module'
import { User } from './user/user.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MatchsModule } from './matchs/matchs.module';
import { Match } from './matchs/match.entity';
import { MessagesModule } from './message/messages.module';
import { Message } from './message/message.entity';

@Module({
  imports: [ChatModule, WSGame, TypeOrmModule.forRoot({
    type:'postgres',
    port: 5432,
    host: 'database',
    username: 'user42',
    password: 'password',
    database: 'database',
    entities: [User,Match, Message],
    synchronize: true,
  }), HttpModule , UsersModule, AuthModule, MatchsModule, MessagesModule],
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
