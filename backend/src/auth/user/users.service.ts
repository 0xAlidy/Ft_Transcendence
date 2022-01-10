import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {getRepository, Repository} from "typeorm";
import {User} from "./user.entity";

 // you can also get it via getConnection().getRepository() or getManager().getRepository()

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>){
  }
  async create(pseudo : string, token: string) {
    const user = new  User(pseudo, token);
    const all = await this.usersRepository.find();
    var ok = true;
    all.forEach(elem => {
      if(pseudo === elem.name)
        ok = false;
    });
    if (ok)
      await this.usersRepository.save(user);
    else
      console.log('already have an account!');
  }
  async findOne(token: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(
      { where:
          { token: token }
      }
  );
    return user;
  }


}
