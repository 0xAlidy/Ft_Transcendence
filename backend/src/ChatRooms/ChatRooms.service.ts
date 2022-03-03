import { Injectable, Logger} from "@nestjs/common";
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
			}
			return await this.getAllRoomName();
		}
		return null;
	}

	async checkBlock(name:string, name1:string){
		console.log(name+ "                       1 " + name1)
		var tocheck = await this.userService.findOneByLogin(name1)
		tocheck.blockedUsers.forEach( element => {
			if (element === name)
				return true
		})
		return false
	}


	async createPriv(user:string[]) {

		if (await this.checkBlock(user[0], user[1]) === false){	
			var newroom = new ChatRooms(null, user[1], "", true,user)
			await this.ChatRoomsRepository.save(newroom);
			return  await this.getAllRoomName();
		}
	}

	async addMessage(data:any)
	{
		var room = await this.findRoomByName(data.dest)
		room.messages.push(data)
		this.ChatRoomsRepository.save(room)
	}

	async addUser(userName:string, roomName:string)
	{
		var room = await this.findRoomByName(roomName)
		if (await this.findUser(userName, roomName) === false ){
			room.users.push(userName)
			this.ChatRoomsRepository.save(room)
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
		var ret:string[]= [];
		all.forEach(element => {
			if (element.IsPrivate === true)
				ret.push(element.name)
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
			if(user.login == element)
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
	
	// encrypt(str:string) {
	// 	const cipher = createCipheriv('aes256', this.key, this.iv);
	// 	const encryptedText = cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
	// 	return encryptedText;
	// }

	// decrypt(toDecrypt:string){
	// 	const decipher = createDecipheriv('aes256', this.key, this.iv);
	// 	// decipher.setAutoPadding(false)
	// 	const decryptedText = decipher.update(toDecrypt, 'hex', 'utf8') + decipher.final('utf8');
	// 	return decryptedText;
	// }

	async changePass(msg:string, dest:string){
		var room = await this.findRoomByName(dest)
		if(room)
		{
			room.password = this.encrypt(msg);
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
		var room = await this.findRoomByName(dest)
		for(var i = 0; i < room.users.length; i++)
		  if (room.users[i] === toFind)
			return true
		return false
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
		console.log(ret)
		return ret;
	}

	checkDoublon(tocheck:string, array:string[]){
		for(var i = 0; i < array.length; i++)
		  if (array[i] === tocheck)
			return true
		return false
	}

	async checkDoublonPriv(name1:string,name2:string){
		var roomlist = await this.getAllRoomName();
		roomlist.forEach(async element => {
			var room = await this.findRoomByName(element)
			if (room.IsPrivate === true  && await this.findUser(name1, element) && await this.findUser(name2, element))
				return true
		});
		return false
	}


	async  banUser(toBan:string, dest:string){
		var room = await this.findRoomByName(dest)
		if(room){
			console.log("to ban = " + toBan)
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




	async addPriv(toPriv:string, sender:string,clientList:any, dest:string){
		var name = toPriv.split(' ').at(1);
		if (await this.userService.findOneByLogin(name)){
			if (await this.checkDoublonPriv(name,sender) || name === sender)
				return "t as deja une room avec lui fdp"
			var user = [sender, name]
			await this.createPriv(user)

			//send other
			var client = this.findClientByName(clientList, name);
			if (client){
				var roomlist = await this.getAllRoomName()

				var newmsg = {sender: 'system', dest:dest, message: sender + " has started a new private room with you", date: ''}
				client._socket.emit('updateRooms',{rooms: roomlist})
				client._socket.emit('ReceiveMessage', {sender: 'system', dest:dest, message: sender + " has started a new private room with you", date: ''})
			}
			else
				return "canno t find user"
			return "new priv room width " + name
		}
		else {
			return "this user doesn t exist try again ou t as deja une room avec lui"
		}
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
			console.log(date , time)
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