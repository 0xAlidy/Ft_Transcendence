import { Injectable, Logger} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/user/users.service";
import {Repository} from "typeorm";
import { ChatRooms } from './ChatRooms.entity';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { createDecipheriv } from 'crypto';

 // you can also get it via getConnection().getRepository() or getManager().getRepository()
 @Injectable()
 export class ChatRoomsService
 {
	password = "";
	iv:Buffer= null;
	key: Buffer;


	async init () {
		this.password = 'Password used to generate key';
		this.iv = randomBytes(16);
		this.key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
	}	


	private logger: Logger = new Logger('UsersService');
	constructor(@InjectRepository(ChatRooms) private ChatRoomsRepository: Repository<ChatRooms>, private userService:UsersService){
	}

	async create(name :string, owner:string, password:Buffer) {
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
		room.users.push(userName)
		this.ChatRoomsRepository.save(room)
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
		console.log(all);
		var ret:string[]= [];
		all.forEach(element => {
			ret.push(element.name)
		});
		return ret;
	}
	async isAuthorized(token:string, name:string){
		var room = await this.findRoomByName(name)
		var user = await this.userService.findOne(token)
		// if(room.owner == user.name)
		// 	return true
		if(room.IsPassword === false)
			return true
		room.users.forEach(element => {
			if(user.name == element)
				return true
		});
		return false
	}


	
	async encrypt(toEncrypt:Buffer) {
		const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);
		const encryptedText = Buffer.concat([
  		cipher.update(toEncrypt),
  		cipher.final(),
		]);
		console.log("encrypted :                     " + encryptedText)
		return encryptedText;
	}

	async decrypt(toDecrypt:Buffer){
		const decipher = createDecipheriv('aes-256-ctr', this.key, this.iv);
		const decryptedText = Buffer.concat([
  		decipher.update(toDecrypt),
  		decipher.final(),
		]);
		console.log("decrypted :                     " + decryptedText)
		return decryptedText;
	}
}
