import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchsModule } from 'src/matchs/matchs.module';
import { UsersModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';

@Module({
	imports:[UsersModule, MatchsModule],
	providers: [GameGateway],
})
export class WSGame {}
