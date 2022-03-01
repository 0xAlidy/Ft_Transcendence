import { Injectable, Logger} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/user/users.service";
import {Repository} from "typeorm";
import { ChatRooms } from './ChatRooms.entity';
import { createCipheriv, randomBytes} from 'crypto';
import { createDecipheriv } from 'crypto';
import { Message } from '../message/message.entity';
import { clientClass } from "src/chat/class/client.class";
import { thisExpression } from "@babel/types";
import { Msg } from "./Msg.dto";

 @Injectable()
 export class ChatRoomsService
 {
	password = "";
	iv:Buffer= null;
	key:string;

	private logger: Logger = new Logger('ChatRoomService');
	constructor(@InjectRepository(ChatRooms) private ChatRoomsRepository: Repository<ChatRooms>, private userService:UsersService){
		this.iv = randomBytes(16);
		this.key = "ceci est une phrase de 32 charac"
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

	async createPriv(user:string[]) {
		var newroom = new ChatRooms(null, user[1], "", true,user)
		console.log(newroom)
		await this.ChatRoomsRepository.save(newroom);
		// return ;
		return  await this.getAllRoomName();
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
		if(room.IsPassword === false)
			return true
		room.users.forEach(element => {
			if(user.nickname == element)
				return true
		});
		return false
	}


	
	async encrypt(toEncrypt:string) {
		this.password = 'password';
		const cipher = createCipheriv('aes256', this.key, this.iv);
		const encryptedText = cipher.update(toEncrypt, 'utf8', 'hex') + cipher.final('hex');
		return encryptedText;
	}

	async decrypt(toDecrypt:string){
		const decipher = createDecipheriv('aes256', this.key, this.iv);
		const decryptedText = decipher.update(toDecrypt, 'hex', 'utf8') + decipher.final('utf8');
		return decryptedText;
	}

	async changePass(msg:string, dest:string){
		var newPass = await this.encrypt(msg.slice(6))
		var room = await this.findRoomByName(dest)
		if (newPass){
			room.password = newPass;
			return true;
		}
		else 
			return false
	
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

	async isAdmin(name:string,dest:string){
		var room = await this.findRoomByName(dest)
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


	async  banUser(arg:string, dest:string, clientList:any){
		var room = await this.findRoomByName(dest)

		var toBan = arg.split(' ').at(1)
		console.log("to ban = " + toBan)
		if (await this.findUser(toBan, dest) === true && this.checkDoublon(toBan, room.banUsers) === false){
			room.banUsers.push(toBan); //ajoute dans la liste des personne banni

			var index = room.users.indexOf(toBan);
			room.users.splice(index, 1)


			this.ChatRoomsRepository.save(room)
			var clientToBan = this.findClientByName(clientList, toBan);
			if (clientToBan){
				clientToBan._socket.leave(room)
				clientToBan._socket.emit('banned')
			}
			return "this user " + toBan + " has been succesfully banned we hope he die in the burning flame of hell :-D"
		}
		else{
			console.log("to ban doesn t exist")
			return "this user " + toBan + " doesn't exist in the room please try again if he deserve"
		}
	}

	async unbanUsers(arg:string, dest:string,clientList:any){
		var toBan = arg.split(' ').at(1)
		var room = await this.findRoomByName(dest)
		var index = room.banUsers.indexOf(toBan)
		room.banUsers.splice(index, 1)
		this.ChatRoomsRepository.save(room)
		var newRoom = await this.getAllRoomName()
		var client = await this.findClientByName(clientList, toBan)
		client._socket.emit('updateRoom',{rooms:newRoom})
		//this.server emit all 
		return "user " + toBan + "is unban"
	}


	async addAdmin(toAdd:string, dest:string,clientList:any){
		var room = await this.findRoomByName(dest)
		var name = toAdd.split(' ').at(1)
		if (await this.findUser(name, dest) === true && this.checkDoublon(name, room.adminList) === false){
			room.adminList.push(name)
			this.ChatRoomsRepository.save(room)
			var clientToAdd:clientClass = this.findClientByName(clientList, name)
			if (clientToAdd){
				clientToAdd._socket.emit('promoteAdmin')
			}
			return "this user " + name + " has been succesfully promoted to admin in " + room.name
		}
		return "this user " + name + " doesn t exist in room " + room.name
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
		await this.ChatRoomsRepository.remove(room)
		return "room " + toDel + " has been deleted"
	}

	addMinutes(date:Date, minutes) {
		return new Date(date).getTime() + minutes * 60000;
	}


	muteUser(msg:Msg){
		var toMute = msg.message.split(' ').at(1);
		var time = +msg.message.split(' ').at(2);
		console.log(msg.date.toTimeString().slice(0,5))
		if (time > 0 && time < 60)
			var t1 = new  Date(this.addMinutes(msg.date, time))
		console.log(t1.toTimeString().slice(0,5))
		// console.log("tomute = " + toMute + " time = " + time + " newdate = " + t1.toString()+ t1.toLocaleString())
		// var room = await this.findRoomByName(rooms)
		// user.IsMuted
	}

	async systemMsg(data:any, clientList:any){
		var help = "/help will help you to know the command you can use from the library for multiple line and other shit like this for long text so cute "
		var unknow = "/ unknow command / try again..."
		if (data.message === "/help")
			data.message = help
		else if (data.message.startsWith("/ban")){
			if(await this.isAdmin(data.sender,data.dest) == true){
				var ret = await this.banUser(data.message, data.dest, clientList)
				console.log(ret)
			}
			else 
				var ret = "echec t es pas admin fdp"
			return ret;
		}
		else if (data.message.startsWith('/mute')){
			if(await this.isAdmin(data.sender,data.dest) == true){
				this.muteUser(data)
			}
		}
		else if(data.message.startsWith("/unban")){
			ret = "null"
			if(await this.isAdmin(data.sender,data.dest) == true)
				var ret = await this.unbanUsers(data.message, data.dest, clientList)
			console.log(ret)
			return ret;
		}
		else if (data.message.startsWith('/setadmin')){
			if( await this.isAdmin(data.sender, data.dest) === true){
				console.log("t es admin et t as le bon debut")
				console.log(data.message)
				return await this.addAdmin(data.message, data.dest, clientList)
			}
			else 
				return "echec t es pas admin fdp"
		}
		else 
			return unknow
	};
}