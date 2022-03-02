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
import { MatchsModule } from './matchs/matchs.module';
import { Match } from './matchs/match.entity';
import { ChatRooms } from './ChatRooms/ChatRooms.entity';
import { NotifModule } from './notifications/notif.module';

@Module({
  imports: [ChatModule, WSGame, NotifModule, TypeOrmModule.forRoot({
    type:'postgres',
    port: 5432,
    host: 'database',
    username: 'user42',
    password: 'password',
    database: 'database',
    entities: [User,Match, ChatRooms],
    synchronize: true,
  }), HttpModule , UsersModule, AuthModule, MatchsModule],
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
