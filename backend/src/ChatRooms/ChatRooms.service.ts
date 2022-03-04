import { Injectable, Logger, ConsoleLogger} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/user/users.service";
import {Repository} from "typeorm";
import { ChatRooms } from './ChatRooms.entity';
import { createCipheriv, randomBytes} from 'crypto';
import { createDecipheriv } from 'crypto';
import { clientClass } from "src/chat/class/client.class";
import { thisExpression } from "@babel/types";
import { Msg } from "./Msg.dto";
import {Mute} from "./Mute.dto"
import { Room } from "src/chat/class/Room.class";

 @Injectable()
 export class ChatRoomsService
 {
	password = "";
	iv:Buffer= null;
	key:string;
	algorithm:string = 'aes-256-ctr';

	private logger: Logger = new Logger('ChatRoomService');
	constructor(@InjectRepository(ChatRooms) private ChatRoomsRepository: Repository<ChatRooms>, private userService:UsersService){
		this.iv = Buffer.from('yen a 16 ou paas');
		this.key = "ft transcendance c'est bien mais"
	}

	async create(name :string, owner:string, password:string) {
		if (name){
			if( await this.findRoomByName(name) === undefined){
				var newroom = new ChatRooms(name, owner, password, false, null)
				await this.ChatRoomsRepository.save(newroom);
				await this.addUser(owner ,name)
			}
			return await this.getAllRoomName();
		}
		return null;
	}
	async deletePrivFromLogins(loginOne:string, loginTwo:string)
	{
		var room;
		if(room = this.privExist(loginOne,loginTwo))
		{
			this.ChatRoomsRepository.delete(room)
		}
	}

	async checkBlock(name:string, name1:string){
		var tocheck = await this.userService.findOneByLogin(name1)
		tocheck.blockedUsers.forEach( element => {
			if (element === name)
				return true
		})
		return false
	}
	async privExist(loginOne:string, loginTwo:string){
		var all = await this.getAllPrivRoom()
		var ret = null;
		all.forEach((value:ChatRooms) => {
			console.log(value.name + " "+ loginOne + loginTwo)
			if(value.name.includes(loginOne) && value.name.includes(loginTwo))
				ret = value
		});
		console.log(ret);
		return ret;
	}

	async createPriv(user:string[]) {
			var newroom = new ChatRooms(null, user[1], "", true,user)
			return await this.ChatRoomsRepository.save(newroom);
	}

	async addMessage(data:any)
	{
		var room = await this.findRoomByName(data.dest)
		room.messages.push(data)
		await this.ChatRoomsRepository.save(room)
	}

	async addUser(userName:string, roomName:string)
	{
		var room = await this.findRoomByName(roomName)
		if(room)
		{
		if (await this.findUser(userName, roomName) === false ){
			room.users.push(userName)
			await this.ChatRoomsRepository.save(room)
		}
		}
	}

	async findRoomByName(name:string){
		return await this.ChatRoomsRepository.findOne(
			{ where:
				{ name: name }
			})
	}
	async getMessagesByRoom(name:string)
	{
		var room = await this.findRoomByName(name)
		if(room)
			return room.messages
		else
			return []
	}

	async getAllRoomName(){
		var all = await this.ChatRoomsRepository.find()
		var ret:string[]= [];
		all.forEach(element => {
				ret.push(element.name)
		});
		return ret;
	}


	async getAllPrivRoom(){
		var all = await this.ChatRoomsRepository.find()
		var ret:ChatRooms[]= [];
		all.forEach(element => {
			if (element.IsPrivate === true)
				ret.push(element)
		});
		return ret;
	}

	async isAuthorized(token:string, name:string){
		var room = await this.findRoomByName(name)
		var user = await this.userService.findOne(token)
		var ret = false;
		 if(room.IsPassword === false)
			ret =  true ;
		room.users.forEach(element => {
			console.log(user.login + " === " + element)
			if(user.login === element)
				ret = true
		});
		return ret
	}

	encrypt(text:string){
		const cipher = createCipheriv(this.algorithm, this.key, this.iv);
		const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
		return encrypted.toString('hex')
	};

	decrypt(text:string){
		const decipher = createDecipheriv(this.algorithm, this.key, Buffer.from(this.iv.toString('hex'), 'hex'));
		const decrpyted = Buffer.concat([decipher.update(Buffer.from(text, 'hex')), decipher.final()]);
		return decrpyted.toString();
	};

	async changePass(msg:string, dest:string){
		var room = await this.findRoomByName(dest)
		if(room)
		{
			console.log(msg);
			room.password = msg;
			await this.ChatRoomsRepository.save(room);
			return 0;
		}
		return 1
	}

	async removePass(dest:string){
		var room = await this.findRoomByName(dest)
		if (room)
		{	room.password = ""
			room.IsPassword = false
			this.ChatRoomsRepository.save(room)
			return 1;
		}
		return 0;
	}


	async findUser(toFind:string, dest:string){
		var ret = false
		var room = await this.findRoomByName(dest)
		if(room){
		for(var i = 0; i < room.users.length; i++)
		  if (room.users[i] === toFind)
			ret = true
		}
		return ret
	  }

	async isBanned(name:string, dest:string){
		var room = await this.findRoomByName(dest)
		for(var i = 0; i < room.banUsers.length; i++)
		  if (room.banUsers[i] == name)
			return true
		return false
	}

	async isOwner(name:string,dest:string)
	{
		var room = await this.findRoomByName(dest)
		if (room.owner === name)
			return true
		else
			return false
	}

	async isAdmin(name:string,dest:string){
		var room = await this.findRoomByName(dest)
		if (room.owner === name)
			return true;
		for(var i = 0; i < room.adminList.length; i++)
		  if (room.adminList[i] == name)
			return true
		return false
	}

	findClientByName(clientList:any, name:string){
		var ret = null;
		clientList.forEach((item:any) => {
			if (item._pseudo === name){
				ret = item;
			}
		});
		return ret;
	}

	checkDoublon(tocheck:string, array:string[]){
		for(var i = 0; i < array.length; i++)
		  if (array[i] === tocheck)
			return true
		return false
	}

	async checkDoublonPriv(name:string,other:string){
		var ret = false
		var roomlist = await this.getAllRoomName();

		for (const element of roomlist) {
			var room = await this.findRoomByName(element)
			if (room.IsPrivate === true  && await this.findUser(name, element) && await this.findUser(other, element))
				ret = true
		}
		return ret
	}

	async findPriv(name1:string,name2:string){
		var ret:ChatRooms | null = null;
		var roomlist = await this.getAllPrivRoom();

		for (const element of roomlist) {
			if (element.users.indexOf(name1) && element.users.indexOf(name2))
				ret = element;
		}
		return ret
	}


	async  banUser(toBan:string, dest:string){
		var room = await this.findRoomByName(dest)
		if(room){
			if ( await this.userService.findOneByLogin(toBan)){
				if(this.checkDoublon(toBan, room.banUsers) === false){
					room.banUsers.push(toBan);
					this.ChatRoomsRepository.save(room);
					return 0;
				}
				return 1;
			}
			return 2;
		}
		return 3;
	}

	async unbanUsers(arg:string, dest:string){
		var room = await this.findRoomByName(dest)
		if(room){
			var index = room.banUsers.indexOf(arg)
			if(index !== -1){
				room.banUsers.splice(index, 1)
				this.ChatRoomsRepository.save(room)
				return 0;
			}
			return 1;
		}
		return 2;
	}


	async addAdmin(toAdd:string, dest:string){
		var room = await this.findRoomByName(dest)
		if (await this.findUser(toAdd, dest) === true)
		{
			if (this.checkDoublon(toAdd, room.adminList) === false)
			{
				room.adminList.push(toAdd)
				await this.ChatRoomsRepository.save(room)
				return 0;
			}
			return 1;
		}
		return 2;
	}




	async addPriv(sender:string, name:string){

			var user = [sender, name]
			return await this.createPriv(user)
	}


	async deleteRoom(toDel:string){
		var room = await this.findRoomByName(toDel)
		if(room){
			await this.ChatRoomsRepository.remove(room)
			return 0
		}
		return 1
	}

	addMinutes(date:Date, minutes) {
		return new Date(date).getTime() + minutes * 60000;
	}


	isMuted(room:ChatRooms, name:string){
		var ret = -1;
		room.muteList.forEach((element,index) => {
			if (element.name === name)
				ret = index;
		});
		return ret;
	}

	async canTalk(name:string, roomName:string)
	{
		var room = await this.findRoomByName(roomName)
		var indexMuted = this.isMuted(room,name)
		if (indexMuted >= 0){
			var date = new Date();
			var time = new Date(room.muteList[indexMuted].endTime)
			if (date.getTime() - time.getTime() < 0){ //still muted
				return false;
			}
			else{
				await this.unMute(name, roomName);
				return true;
			}
		}
		else
			return true;
	}

	async unMute(login:string, roomName:string){
		var room = await this.findRoomByName(roomName)
		var index = this.isMuted(room, login)
		room.muteList.splice(index, 1);
		await this.ChatRoomsRepository.save(room)
	}

	async muteUser(msg:Msg, login:string){
		var toMute = login;
		var time = +msg.message.split(' ').at(2);
		var room = await this.findRoomByName(msg.dest)
		if (this.isMuted(room,toMute) < 0){
			if (time && time > 0 && time < 61){
				var t1 = new  Date(this.addMinutes(msg.date, time))
				var newMute:Mute = {name:toMute, endTime:t1}
				room.muteList.push(newMute)
				await this.ChatRoomsRepository.save(room)
				return 0;
			}
			return 1;
		}
		return 2;
	}
}
