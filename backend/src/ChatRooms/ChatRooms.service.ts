import { Injectable, Logger} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/user/users.service";
import {Repository} from "typeorm";
import { ChatRooms } from './ChatRooms.entity';
import { createCipheriv, randomBytes} from 'crypto';
import { createDecipheriv } from 'crypto';
import { Message } from '../message/message.entity';
import { clientClass } from "src/chat/class/client.class";

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
		if( await this.findRoomByName(name) === undefined){
			var match = new ChatRooms(name, owner, password)
			await this.ChatRoomsRepository.save(match);
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
		for(var i = 0; i < room.users.length; i++)
		  if (room.blockedUsers[i] === name)
			return true
		return false
	}

	findClientByName(clientList:any, name:string){
		clientList.forEach((item:clientClass) => {
			if (item._pseudo === name)
				return (item)
		});
		return null;
	}



	async  banUser(arg:string, dest:string, clientList:any){
		var room = await this.findRoomByName(dest)

		var toBan = arg.split(' ').at(1)
		console.log(toBan)
		if (await this.findUser(toBan, dest) === true){
			room.blockedUsers.push(toBan); //ajoute dans la liste des personne banni
			this.ChatRoomsRepository.save(room)
			var clientToBan = this.findClientByName(clientList, toBan);
			console.log("find client")
			if (clientToBan){
				console.log("emit1")
				clientToBan._socket.leave(room)
				console.log("emit2")
				clientToBan._socket.emit('banned')
				console.log("emit3")
			}
			console.log("emit4")
			//kick + message socket 
			return "this user " + toBan + " has been succesfully banned we hope he die in the burning flame of hell :-D"
		}
		else{
			console.log("to ban doesn t exist")
			return "this user " + toBan + " doesn't exist in the room please try again if he deserve else go kill yourself"
		}
	  }
	
	//   unbanUser = (toUnban:string) => {
	// 	var isBlock: boolean = false;
	// 	for(var i = 0; i < this.users.length; i++)
	// 	{
	// 	  if (this.users[i] === toUnban)
	// 		isBlock = true
	// 	}
	// 	if (isBlock == false)
	// 	  return false
	// 	else 
	// 	{
		  
	// 	}
	//  }

	async systemMsg(data:any, clientList:any){
		var help = "/help will help you to know the command you can use from the library for multiple line and other shit like this for long text so cute "
		var unknow = "/ unknow command / try again..."
		// var pass = "/ your password has been change"
		console.log(data.message + "dsfbsdfhjvbdfshbahjskb shjkfh ajskdvuaisjhc nucxbhjn hee")
		if (data.message === "/help")
			data.message = help
		else if (data.message.startsWith("/ban")){
			data.message = await this.banUser(data.message, data.dest, clientList)
			console.log(data.message)
		}
		// else if (data.message.beginWidth("/pass")){
		// 	// this.changePass(data.message, data.dest)
		// 	data.message = pass;
		// }
		else 
			data.message = unknow

	}
}
