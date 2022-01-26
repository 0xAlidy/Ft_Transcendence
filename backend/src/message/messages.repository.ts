import { EntityRepository, Repository } from 'typeorm';
import { Match } from './match.entity';
import { MatchDto } from './match.dto';

@EntityRepository(Match)
export class UsersRepository extends Repository<Match> {
  createUser = async (MatchDto: MatchDto) => {
    return await this.save(MatchDto);
  };
}
