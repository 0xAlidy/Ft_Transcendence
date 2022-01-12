import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/auth/user/user.module';
import { GameGateway } from './game.gateway';

@Module({
	imports:[UsersModule],
	providers: [GameGateway],
})
export class WSGame {}
