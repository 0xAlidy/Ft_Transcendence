import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UserPublic } from '../interfaces'
var qrcode = require('qrcode');
var speakeasy = require('speakeasy');

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(@InjectRepository(User) private usersRepository: Repository<User>){}

  async create(login: string, token: string)
  {
    const user:User = new User(login, token);
    const all:User[] = await this.usersRepository.find();
    let ok:boolean = true;
    let existing:User;
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

  async removeWaitingFriend(token:string, login:string)
  {
    var user = await this.findOne(token)
    var index = user.waitingFriends.indexOf(login);
    if (index !== -1)
      user.waitingFriends.splice(index, 1);
    await this.usersRepository.save(user);
  }
  async setInGameBylogin(login: string, status:number){
      var user = await this.findOneByLogin(login)
     user.status = status;
      await this.usersRepository.save(user);
  }

  async addWaitingFriend(login:string, loginFriend:string)
  {
    var user = await this.findOneByLogin(login);
    user.waitingFriends.push(loginFriend);
    await this.usersRepository.save(user);
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

  async addFriend(token:string, loginFriend:string)
  {
    var user = await this.findOne(token);
    var friend = await this.findOneByLogin(loginFriend)
    var index = user.waitingFriends.indexOf(friend.login);
    if (index !== -1)
      user.waitingFriends.splice(index,1);
    index = friend.waitingFriends.indexOf(user.login);
    if (index !== -1)
      friend.waitingFriends.splice(index,1);
    user.friends.push(loginFriend);
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

  async addBlocked(token:string, login:string)
  {
    var user = await this.findOne(token);
    user.blockedUsers.push(login);
    await this.usersRepository.save(user);
  }

  async removeBlocked(token:string, login:string)
  {
    var user = await this.findOne(token);
    const index = user.blockedUsers.indexOf(login);
    user.blockedUsers.splice(index, 1);
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


  async getUserImage(token:string, login:string){

    var verif = await this.findOne(token);
    if (verif){
      var user = await this.findOneByLogin(login);
      if(user)
      return({
        imgUrl: user.imgUrl
      })
    }
    return null;
  }

  async getUserPublic(token:string, login:string):Promise<UserPublic>{
    var verif = await this.findOne(token);
    if (verif){
      var user = await this.findOneByLogin(login);
      if (user)
      {
        let isFriend = user.friends.indexOf(verif.login) !== -1 ? 1 : 0; // 0 = none, 1 = friend, 2 = waiting , 3 = blockMe, 4 = blocked
        isFriend = user.waitingFriends.indexOf(verif.login) !== -1 ? 2 : isFriend;
        isFriend = user.blockedUsers.indexOf(verif.login) !== -1 ? 3 : isFriend;
        isFriend = verif.blockedUsers.indexOf(user.login) !== -1 ? 4 : isFriend;
        return({
          isFriend: isFriend,
          imgUrl: user.imgUrl,
          status: user.status,
          lvl: user.lvl,
          login: user.login,
          nickname: user.nickname,
          numberOfLose: user.numberOfLose,
          numberOfWin: user.numberOfWin,
          xp: user.xp,
        })
      }
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

  async getLoginByNickname(nick:string)
  {
    var user = await this.findOneByNickname(nick);
    if(user)
      return(user.login)
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


  async setStatus(token:string, status:number){
    const user = await this.findOne(token);
    if (user){
      user.status = status;
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
    user.numberOfLose++;
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

  async setColor(data:any)
  {
    var user =  await this.findOne(data.token);
    user.color = data.color;
    await this.usersRepository.save(user);
  }
}
