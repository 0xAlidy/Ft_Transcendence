
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserDto } from './interfaces/user.dto';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDto])],
  providers: [UsersService],
  controllers: [UsersService],
})
export class UsersModule {}
