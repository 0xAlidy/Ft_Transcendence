import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsService} from './ChatRooms.service';
import { ChatRooms } from './ChatRooms.entity';
import { ChatRoomsController } from './ChatRooms.controller';
import { UsersModule } from 'src/user/user.module';
import { UsersService } from '../user/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRooms]), UsersModule], //privroom
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, UsersService],
  exports: [ChatRoomsService],
})
export class ChatRoomsModule {}

// TypeOrmModule.forFeature([])