import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {User} from "./user.entity";
var qrcode = require('qrcode');
var speakeasy = require('speakeasy');

/*
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
*/

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>){ }

  async create(login: string, token: string)
  {
    const user = new  User(login, token);
    const all = await this.usersRepository.find();
    var ok = true;
    var existing :User;
    all.forEach(elem => {
      if (login === elem.login)
      {
        existing = elem;
        existing.token = token;
        ok = false;
      }
    });
    if (ok)
      return await this.usersRepository.save(user);
    else
      return await this.usersRepository.save(existing);
  }

  async friendRequest(token:string, nickname:string)
  {
    var user = await this.findOne(token);
    if (user)
    {
      var other = await this.findOneByNickname(nickname);
      other.waitingFriends.push(user.nickname);
      await this.usersRepository.save(other);
    }
  }
  async removeWaitingFriend(token:string, login:string){
    var user = await this.findOne(token)
    user.waitingFriends.splice(user.waitingFriends.indexOf(login),1)
    this.usersRepository.save(user);
  }

  async addWaitingFriend(login:string, friend:string)
  {
      var user = await this.findOneByLogin(login);
      if(user.waitingFriends.indexOf(friend) < 0 && user.friends.indexOf(friend) < 0)
      {
        user.waitingFriends.push(friend);
        await this.usersRepository.save(user);
        return 1;
      }
      return 0;
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

  async addFriend(token:string, login:string)
  {
    var user = await this.findOne(token);
    var friend = await this.findOneByLogin(login)
    user.friends.push(login);
    friend.friends.push(user.login)
    await this.usersRepository.save(user);
    await this.usersRepository.save(friend);
  }

  async removeFriend(token:string, login:string)
  {
    var user = await this.findOne(token);
    var friend = await this.findOneByLogin(login);
    friend.friends.splice(friend.friends.indexOf(login), 1);
    user.friends.splice(user.friends.indexOf(login), 1);
    await this.usersRepository.save(user);
    await this.usersRepository.save(friend);
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

  async changeWSId(token:string, id:string)
  {
    var user = await this.findOne(token);
    if (user != null)
    {
      this.logger.log(user.nickname + ' his WSid change for ' + id);
      user.WSId = id;
      await this.usersRepository.save(user);
    }
  }

  async changetoken(login: any, newToken:any)
  {
    var user = await this.findOneByLogin(login);
    user.token = newToken;
    await this.usersRepository.save(user);
    return await this.findOneByLogin(login);
  }

  async getUserPublic(token:string, login:string){

    var verif = await this.findOne(token);
    if (verif){
      var user = await this.findOneByLogin(login);
      if(user)
      return({
        imgUrl: user.imgUrl,
        isActive: user.isActive,
        lvl: user.lvl,
        login: user.login,
        nickname: user.nickname,
        numberOfLoose: user.numberOfLoose,
        numberOfWin: user.numberOfWin,
        xp: user.xp,
      })
    }
    return null;
  }
  async getNickame(login:string)
  {
    var user = await this.findOneByLogin(login);
    if(user)
      return(user.nickname)
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
    user.nickname = data.nickname;
    return await this.usersRepository.save(user);
  }

  async changeNickname(data:any)
  {
    var user = await this.findOne(data.token);
    user.nickname = data.nickname;
    await this.usersRepository.save(user);
  }

  async findOne(token: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(
      {
        where:
          { token: token }
      }
    );
    return user;
  }

  async findOneByNickname(nickname: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(
      {
        where:
          { nickname: nickname }
      }
    );
    return user;
  }

  async nicknameAvailable(nickname: string){
    let user = await this.findOneByNickname(nickname);
    if (user)
      return false;
    else
      return true;
  }

  async findOneByLogin(login: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(
      {
        where:
          { login: login }
      }
    );
    return user;
  }

  async setIsActive(nickname:string, bool: boolean){
    const user = await this.findOneByNickname(nickname);
    if (user){
      user.isActive = bool;
      await this.usersRepository.save(user);
    }
  }

  async xp(token:string,num: number)
  {
    var user = await this.findOne(token);
    if(!user)
      return;
    user.xp += num;
    if (user.xp >= 100)
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

  async disableSecret(data:any)
  {
    var user = await this.findOne(data.token);
    user.secret = 'null';
    user.secretEnabled = false;
    await this.usersRepository.save(user);
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
