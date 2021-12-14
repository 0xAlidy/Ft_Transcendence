import { Injectable } from "@nestjs/common";
import {getRepository, Repository} from "typeorm";
import { UserDto } from "./interfaces/user.dto";
import {User} from "./user.entity";

 // you can also get it via getConnection().getRepository() or getManager().getRepository()

@Injectable()
export class UsersService {
  private readonly cats: User[] = [];
  userRepository: Repository<User>;
  constructor(){
    this.userRepository = getRepository(User);
  }
  async create(user: UserDto) {
    console.log('wtf');
    await this.userRepository.save(user);
  }

  findAll(): User[] {
    return this.cats;
  }
}