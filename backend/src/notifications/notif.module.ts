import { Module } from '@nestjs/common';
import { ChatRoomsModule } from 'src/ChatRooms/ChatRooms.module';
import { UsersModule } from 'src/user/user.module';
import { NotifGateway } from './notif.gateway';

@Module({
	imports:[UsersModule,ChatRoomsModule],
	providers: [NotifGateway],
})
export class NotifModule {}
