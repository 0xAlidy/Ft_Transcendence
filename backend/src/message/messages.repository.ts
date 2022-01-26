import { EntityRepository, Repository } from 'typeorm';
import { Message } from './message.entity';
import { MessageDto } from './message.dto';

@EntityRepository(Message)
export class UsersRepository extends Repository<Message> {
  createUser = async (MatchDto: MessageDto) => {
    return await this.save(MatchDto);
  };
}
