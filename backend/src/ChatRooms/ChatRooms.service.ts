import { Injectable, Logger} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/user/users.service";
import {Repository} from "typeorm";
import { ChatRooms } from './ChatRooms.entity';
import { createCipheriv, randomBytes} from 'crypto';
import { createDecipheriv } from 'crypto';
import { Message } from '../message/message.entity';
import { clientClass } from "src/chat/class/client.class";
import { Client } from 'socket.io/dist/client';
import { PrivRoomService } from '../PrivRoom/PrivRoom.service';

 @Injectable()
 export class ChatRoomsService
 {
	password = "";
	iv:Buffer= null;
	key:string;

	private logger: Logger = new Logger('ChatRoomService');
	constructor(@InjectRepository(ChatRooms) private ChatRoomsRepository: Repository<ChatRooms>, private PrivRoomService:PrivRoomService,private userService:UsersService){
		this.iv = randomBytes(16);
		this.key = "ceci est une phrase de 32 charac"
	}

	async create(name :string, owner:string, password:string) {
		if( await this.findRoomByName(name) === undefined){
			var newroom = new ChatRooms(name, owner, password)
			await this.ChatRoomsRepository.save(newroom);
		}
		return await this.getAllRoomName();
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
	async isAuthorized(token:string, name:string){
		var room = await this.findRoomByName(name)
		var user = await this.userService.findOne(token)
		if(room.IsPassword === false)
			return true
		room.users.forEach(element => {
			if(user.name == element)
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
		for(var i = 0; i < room.blockedUsers.length; i++)
		  if (room.blockedUsers[i] === name)
			return true
		return false
	}

	async isAdmin(name:string,dest:string){
		var room = await this.findRoomByName(dest)
		for(var i = 0; i < room.adminList.length; i++)
		  if (room.adminList[i] === name)
			return true
		return false
	}

	findClientByName(clientList:any, name:string){
		clientList.forEach((item:clientClass) => {
			console.log("-------------------------")
			console.log(item._pseudo+ "     " + name)
			console.log("-------------------------")
			if (item._pseudo === name){
				console.log("SUCCESS MOTHERFUCKER")
				console.log(item)
				return item
			}
		});
		return null;
	}

	checkDoublon(tocheck:string, array:string[]){
		for(var i = 0; i < array.length; i++)
		  if (array[i] === tocheck)
			return true
		return false
	}


	async  banUser(arg:string, dest:string, clientList:any){
		var room = await this.findRoomByName(dest)

		var toBan = arg.split(' ').at(1)
		console.log(toBan)
		if (await this.findUser(toBan, dest) === true && this.checkDoublon(toBan, room.blockedUsers) === false){
			room.blockedUsers.push(toBan); //ajoute dans la liste des personne banni
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
			return "this user " + toBan + " doesn't exist in the room please try again if he deserve else go kill yourself"
		}
	}

	async addAdmin(toAdd:string, dest:string,clientList:any){
		var room = await this.findRoomByName(dest)

		var name = toAdd.split(' ').at(1)
		console.log(room.name + "   " + name)
		if (await this.findUser(name, dest) === true && this.checkDoublon(name, room.adminList) === false){
			room.adminList.push(name)
			console.log("push")
			this.ChatRoomsRepository.save(room)
			var clientToAdd:clientClass = this.findClientByName(clientList, name);
			console.log("-------------------------")
			console.log(clientToAdd)
			console.log("-------------------------")
			if (clientToAdd){
				console.log("yoyoyoyoyyo client to add ")
				console.log("-------------------------")
				clientToAdd._socket.emit('promoteAdmin')
			}
			return "this user " + name + " has been succesfully promoted to admin in " + room.name
		}
		return "this user " + name + " doesn t exist in room " + room.name
	}
	


	addPriv(crea:string, dest:string,clientList:any){
		 this.PrivRoomService.create(crea, dest)
		 return "new priv room"
	}



	async systemMsg(data:any, clientList:any){
		var help = "/help will help you to know the command you can use from the library for multiple line and other shit like this for long text so cute "
		var unknow = "/ unknow command / try again..."
		if (data.message === "/help")
			data.message = help
		else if (data.message.startsWith("/ban")){
			if(await this.isAdmin(data.sender,data.dest) === true)
				data.message = await this.banUser(data.message, data.dest, clientList)
			else 
				data.message = "echec t es pas admin fdp"
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
		else if (data.message.startsWith('/priv')){
			return await this.addPriv(data.message, data.dest, clientList)
		}
		// else if (data.message.beginWidth("/pass")){
		// 	// this.changePass(data.message, data.dest)
		// 	data.message = pass;
		// }
		else 
			return unknow

	}
}
