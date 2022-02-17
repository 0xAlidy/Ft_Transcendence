import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { NotifGateway } from './notif.gateway';

@Module({
	imports:[UsersModule],
	providers: [NotifGateway],
})
export class NotifModule {}
