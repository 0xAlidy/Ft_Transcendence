import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from './user/user.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService]
})
export class AuthModule {}
