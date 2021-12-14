import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserDto } from './interfaces/user.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  createUser = async (UserDto: UserDto) => {
    return await this.save(UserDto);
  };
}
