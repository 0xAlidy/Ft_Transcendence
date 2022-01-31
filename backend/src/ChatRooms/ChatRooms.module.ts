import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsService} from './ChatRooms.service';
import { ChatRooms } from './ChatRooms.entity';
import { ChatRoomsController } from './ChatRooms.controller';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRooms]), UsersModule],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
  exports: [ChatRoomsService],
})
export class ChatRoomsModule {}
