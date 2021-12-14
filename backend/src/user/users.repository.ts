import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserDto } from './interfaces/user.dto';

@EntityRepository(User)
export class DogRepository extends Repository<User> {
  createDog = async (UserDto: UserDto) => {
    return await this.save(UserDto);
  };
}
