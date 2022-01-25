import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchsService} from './matchs.service';
import { Match } from './match.entity';
import { MatchsController } from './matchs.controller';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), UsersModule],
  controllers: [MatchsController],
  providers: [MatchsService],
  exports: [MatchsService],
})
export class MatchsModule {}
