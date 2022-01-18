import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchsService} from './matchs.service';
import { Match } from './match.entity';
import { MatchsController } from './matchs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchsController],
  providers: [MatchsService],
  exports: [MatchsService],
})
export class MatchsModule {}
