import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { stringify } from "querystring";
import {getRepository, Repository} from "typeorm";
import { User, privRoom } from './user.entity';
// import { user } from '../../../frontend/src/components/MainPage/MainPage';
var qrcode = require('qrcode');
var speakeasy = require('speakeasy');

 // you can also get it via getConnection().getRepository() or getManager().getRepository()

interface SecretData {
  otpauth_url: string
}

interface userPublic{
  imgUrl: string;
  isActive: false;
  lvl: number;
  name: string;
  nickname: string;
  numberOfLoose: number;
  numberOfWin: number;
  xp: number;
}
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
    if (ok){
      return await this.usersRepository.save(user);
    }
    else
    {
      return await this.usersRepository.save(existing);
    }
  }

  async friendRequest(token:string, name:string){
    var user = await this.findOne(token);
    if (user)
    {
      var other = await this.findOneByName(name);
      other.waitingFriends.push(user.name);
      await this.usersRepository.save(other);
    }
  }
  async acceptFriendRequest(token:string, name:string)
  {
    var user = await this.findOne(token);
  }

  async addRoom(token:string, room:string)
  {
    var user = await this.findOne(token);
    user.rooms.push(room);
    await this.usersRepository.save(user);
  }
  async leaveRoom(token:string, room:string)
  {
    var user = await this.findOne(token);
    const index = user.rooms.indexOf(room);
    user.rooms.splice(index, 1);
    await this.usersRepository.save(user);
  }
  async addFriend(token:string, room:string)
  {
    var user = await this.findOne(token);
    user.rooms.push(room);
    await this.usersRepository.save(user);
  }
  async removeFriend(token:string, room:string)
  {
    var user = await this.findOne(token);
    user.rooms.push(room);
    await this.usersRepository.save(user);
  }
  async addBlocked(token:string, room:string)
  {
    var user = await this.findOne(token);
    user.rooms.push(room);
    await this.usersRepository.save(user);
  }
  async removeBlocked(token:string, room:string)
  {
    var user = await this.findOne(token);
    user.rooms.push(room);
    await this.usersRepository.save(user);
  }

  async changeWSId(name:string, id:string){
      var user = await this.findOneByName(name);
      if(user != null){
      this.logger.log(user.name + ' his WSid change for ' + id);
      user.WSId = id;
      await this.usersRepository.save(user);}
  }
  async changetoken(username: any, newToken:any){
    var user = await this.findOneByName(username);
    user.token = newToken;
    await this.usersRepository.save(user);
    return await this.findOneByName(username)
}
  async getUserPublic(token:string, name:string){

    var verif = await this.findOne(token);
    if(verif != undefined){
      var user = await this.findOneByName(name);
      return({
        imgUrl: user.imgUrl,
        isActive: user.isActive,
        lvl: user.lvl,
        name: user.name,
        nickname: user.nickname,
        numberOfLoose: user.numberOfLoose,
        numberOfWin: user.numberOfWin,
        xp: user.xp,
      })
    }
    return null;
  }

  async changeImgUrl(data:any)
  {
    var user = await this.findOne(data.token);
    user.imgUrl = data.url;
    return await this.usersRepository.save(user);
  }

  async completeProfile(data:any)
  {
    var user = await this.findOne(data.token);
    user.firstConnection = false;
    user.imgUrl = data.url;
    user.nickname = data.name;
    return await this.usersRepository.save(user);
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

  async generateSecret(data:any)
  {
    var user = await this.findOne(data.token);
    const secret = speakeasy.generateSecret();
    user.secret = secret.base32;
    await this.usersRepository.save(user);
    return await qrcode.toDataURL(secret.otpauth_url);
  }

  async verifyNumber(data:any)
  {
    var user = await this.findOne(data.token);
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: data.number
    })
    if (verified)
    {
      user.secretEnabled = true;
      await this.usersRepository.save(user);
    }
    return verified;
  }

  async secretEnabled(data:any)
  {
    var user = await this.findOne(data.token);
    return user.secretEnabled;
  }
}
