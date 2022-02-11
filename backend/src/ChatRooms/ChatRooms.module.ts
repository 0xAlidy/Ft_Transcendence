import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsService} from './ChatRooms.service';
import { ChatRooms } from './ChatRooms.entity';
import { ChatRoomsController } from './ChatRooms.controller';
import { UsersModule } from 'src/user/user.module';
import { PrivRoomModule } from '../PrivRoom/PrivRoom.module';
import { PrivRoomService } from '../PrivRoom/PrivRoom.service';
import { UsersService } from '../user/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRooms]), UsersModule, PrivRoomModule],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, PrivRoomService, UsersService],
  exports: [ChatRoomsService],
})
export class ChatRoomsModule {}
