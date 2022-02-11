import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivRoomService} from './PrivRoom.service';
import { PrivRoom } from './PrivRoom.entity';
import {PrivRoomController } from './PrivRoom.controller';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PrivRoom]), UsersModule],
  controllers: [PrivRoomController],
  providers: [PrivRoomService],
  exports: [PrivRoomService],
})
export class PrivRoomModule {}
