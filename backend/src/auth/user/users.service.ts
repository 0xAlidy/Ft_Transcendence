import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {getRepository, Repository} from "typeorm";
import {User} from "./user.entity";

 // you can also get it via getConnection().getRepository() or getManager().getRepository()

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>){
  }
  async create(pseudo : string, token: string) {
    const user = new  User(pseudo, token);
    const all = await this.usersRepository.find();
    var ok = true;
    var existing :User;
    all.forEach(elem => {
      if(pseudo === elem.name)
      {
        existing = elem;
        existing.token = token;
        ok = false;
      }
      });
    if (ok)
      return await this.usersRepository.save(user);
    else
    {
      return await this.usersRepository.save(existing);
    }
  }

  async changeWSId(name:string, id:string){
      var user = await this.findOneByName(name);
      this.logger.log(user.name + ' his WSid change for ' + id);
      user.WSId = id;
      await this.usersRepository.save(user);
  }
  async changetoken(username: any, newToken:any){
    var user = await this.findOneByName(username);
    user.token = newToken;
    await this.usersRepository.save(user);
    return await this.findOneByName(username)
}

  async findOne(token: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(
      { where:
          { token: token }
      }
    );
    if(!user)
      return undefined;
    return user;
  }
  async findOneByName(name: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(
      { where:
          { name: name }
      }
  );
    return user;
  }

  async setIsActive(name:string,bool: boolean){
    const user = await this.findOneByName(name);
    if(user){
      user.isActive = bool;
      await this.usersRepository.save(user);
    }
  }
  async xp(token:string,num: number)
  {
    var user = await this.findOne(token);
    user.xp += num;
    if(user.xp >= 100)
    {
      user.xp = user.xp - 100;
      user.lvl++;
    }
    await this.usersRepository.save(user);
  }

  async win(token:string)
  {
    var user = await this.findOne(token);
    user.numberOfWin++;
    await this.usersRepository.save(user);
  }

  async loose(token:string)
  {
    var user = await this.findOne(token);
    user.numberOfLoose++;
    await this.usersRepository.save(user);
  }
}
