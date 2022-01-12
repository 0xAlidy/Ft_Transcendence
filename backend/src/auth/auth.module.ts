import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from './user/user.module';
import {PassportModule} from "@nestjs/passport"
import { FTStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService,FTStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
