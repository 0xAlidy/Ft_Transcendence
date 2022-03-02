import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { clientClass } from "./class/client.class";
import { ChatRoomsService } from 'src/ChatRooms/ChatRooms.service';
import { Client } from 'socket.io/dist/client';
import { UsersService } from 'src/user/users.service';
import { Msg } from 'src/ChatRooms/Msg.dto';

@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayInit {

  constructor(private readonly chatService: ChatRoomsService, private readonly userService: UsersService){
  }
  clients = new Map<string, clientClass>();
  rooms: string[];
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  async afterInit(server: any) {
    this.logger.log('Initialized!');
	this.rooms = await this.chatService.create('general', 'system', "");
  }


  async handleConnection(client:Socket, ...args: any[]){
    this.logger.log("New Conection on the Chat!");
    client.join("general");
    console.log(client.handshake.query.token as string)
    var user = await this.userService.findOne(client.handshake.query.token as string)
    this.clients.set(client.id,new clientClass(client, user.token, user.login));
    client.emit('updateRooms',{rooms: this.rooms});
	this.loadRoom(client, 'general')
  }

  handleDisconnect(client: Socket) {
    this.logger.log("disconnected!");
	var user = this.clients.get(client.id)
	if (user)
		this.clients.delete(client.id);
  }

  @SubscribeMessage('getRoomList')
  roomList(client:Socket, data:any){
    client.emit('updateRooms',{rooms: this.rooms});
  }

  @SubscribeMessage('password')
  async password(client:Socket, data:any){
    var tocheck = await this.chatService.findRoomByName(data.room)
    var decrypted = await this.chatService.decrypt(tocheck.password)
    if (data.pass === decrypted)
    {
	  await this.loadRoom(client, data.room)
      client.leave(this.clients.get(client.id)._room)
      client.join(data.room)
      this.clients.get(client.id)._room = data.room
    }
  }

  @SubscribeMessage('newRoom')
  async addRoom(client:Socket, data:any){
    if (data.password){
      var passEncrypt = this.chatService.encrypt(data.password)
      var update = await this.chatService.create(data.name, data.creator, passEncrypt);
    }
    else
      var update = await this.chatService.create(data.name, data.creator, '');
    this.server.emit('updateRooms',{rooms: update})
	this.loadRoom(client, data.name);
}

  @SubscribeMessage('joinRoom')
  async joinRoom(client:Socket, data:any){
    var bool = await this.chatService.isAuthorized(this.clients.get(client.id)._token, data.room)
    var user = this.clients.get(client.id)._pseudo
    if(bool){
		if (await this.chatService.isBanned(user,data.room) == false){
      		var msg = await this.chatService.getMessagesByRoom(data.room);
			this.loadRoom(client, data.room)
     		this.chatService.addUser(user, data.room)
			  this.clients.get(client.id)._room = data.room
		}
		else{
				client.emit('chatNotifError', {msg:'You are ban from ' +data.room + "!"})
		}
    }
	else
      client.emit('needPassword', {room:data.room})
  }
  async loadRoomAll(roomName:string, moveRoom:string)
  {
		var msg = await this.chatService.getMessagesByRoom('general');
		var room = await this.chatService.findRoomByName(roomName);
		if (room.users){
			room.users.forEach((value) =>{
	  			var user = this.getUserByName(value)
				if (user._room !== "")
					user._socket.leave(user._room);
				user._socket.join(moveRoom)
				this.messageToOtherClient(value, 'loadRoom', {room:moveRoom, msg:msg})
			})
		}
  }
  async loadRoom(client:Socket, roomName:string)
  {
	  var user = this.clients.get(client.id);
	  if (user._room !== "")
	  	user._socket.leave(user._room);
	  user._socket.join(roomName)
	  var msg = await this.chatService.getMessagesByRoom(roomName);
	  client.emit('loadRoom', {room:roomName, msg:msg})
  }
  getUserByName(str:string):null|clientClass{
	var ret = null;
	this.clients.forEach( element => {
		if(element._pseudo === str)
			ret = element;
	})
	return ret
  }

  messageToOtherClient(login:string, messageSocket:string, data:any)
  {
	var user = this.getUserByName(login)
	if (user)
	{
		user._socket.emit(messageSocket, data)
	}
  }


async command(client: Socket,Message:Msg){
	var help = "/help will help you to know the command you can use from the library for multiple line and other shit like this for long text so cute "
	var unknow = "/ unknow command / try again..."
	var resp = 0;

	if (Message.message.startsWith('/help'))
		client.emit('ReceiveMessage',{sender:'system' , dest:Message.dest, message: help, date: new Date()})
	else if (Message.message.startsWith('/delete')) {
		console.log("/delete")
		if(await this.chatService.isOwner(Message.sender,Message.dest) == true){
			await this.loadRoomAll(Message.sender,'general')
			if(await this.chatService.deleteRoom(Message.dest) === 0){
				var rooms = await this.chatService.getAllRoomName();
				this.server.to(Message.dest).emit('chatNotif',{msg:'the room' + Message.dest + 'has been deleted, you are now logged to general'})
				this.server.emit('updateRooms', {rooms:rooms});
			}
			else
				client.emit('chatNotifError', {msg:'Canno\'t find ' + Message.dest})

		}
		else
			client.emit('chatNotifError', {msg:'You need to be owner to do that'})

	}
	else if (Message.message.startsWith("/ban")){
		if(await this.chatService.isAdmin(Message.sender,Message.dest) == true){
			resp = await this.chatService.banUser(Message.message.split(' ').at(1), Message.dest)
			if (resp === 0){
				client.emit('chatNotif', {msg:Message.message.split(' ').at(1) + 'is now banned'})
				this.loadRoom(this.getUserByName(Message.message.split(' ').at(1))._socket, 'general')
				this.messageToOtherClient(Message.message.split(' ').at(1), 'chatNotifError', {msg:'You are now banned for the channel '+ Message.dest})
			}
			if (resp === 1)
				client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' is already banned'})
			if (resp === 2)
				client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' doesn\'t exist'})
			if (resp === 3)
				client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' doesn\'t exist'})
		}
		else{
			client.emit('chatNotifError', {msg:'You need to be admin to do that'})
		}
	}
	else if (Message.message.startsWith('/mute')){
		if(await this.chatService.isAdmin(Message.sender,Message.dest) == true){
			resp = await this.chatService.muteUser(Message)
			if (resp === 0){
				client.emit('chatNotif', {msg:Message.message.split(' ').at(1) + 'is now muted'})
				this.messageToOtherClient(Message.message.split(' ').at(1), 'chatnote', {msg:'You are now muted for '+ Message.message.split(' ').at(2) + 'min'})
			}
			if (resp === 1)
				client.emit('chatNotifError', {msg:'Please enter a number between 1 and 60'})
			if (resp === 2)
				client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' is already muted'})
		}
		else{
			client.emit('chatNotifError', {msg:'You need to be admin to do that'})
		}
	}
	else if(Message.message.startsWith("/unban")){
		if(await this.chatService.isAdmin(Message.sender,Message.dest) == true){
			resp = await this.chatService.unbanUsers(Message.message.split(' ').at(1), Message.dest)
			if (resp === 0){
				client.emit('chatNotif', {msg:Message.message.split(' ').at(1) + 'is not unban'})
				this.messageToOtherClient(Message.message.split(' ').at(1), 'chatnote', {msg:'You are now unban in the channel '+ Message.dest})
			}
			if (resp === 1)
				client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + 'is not ban'})
			if (resp === 2)
				client.emit('chatNotifError', {msg:'error'})
		}
		else
			client.emit('chatNotifError', {msg:'You need to be admin to do that'})
	}
	else if(Message.message.startsWith("/password")){
		if(await this.chatService.isOwner(Message.sender,Message.dest) == true){
			//argument
			 resp = await  this.chatService.changePass(Message.message.split(' ').at(1), Message.dest)
			if (resp === 0)
				 client.emit('chatNotif', {msg:'the password has been changed'})
			if (resp === 1)
				client.emit('chatNotifError', {msg:'error'})
		}
		else
		client.emit('chatNotifError', {msg:'Only owner can do that'})
			
	}
	else if (Message.message.startsWith("/delete password")){
		if(await this.chatService.isOwner(Message.sender,Message.dest) == true)
			if (await this.chatService.removePass(Message.dest))
				client.emit('chatNotif', {msg:'the password has been removed'})
			else
				client.emit('chatNotifError', {msg:'error'})
	}
	else if (Message.message.startsWith('/setadmin')){
		if( await this.chatService.isAdmin(Message.sender, Message.dest) === true){
			resp = await this.chatService.addAdmin(Message.message.split(' ').at(1), Message.dest)
			if (resp === 0){
				client.emit('chatNotif', {msg: Message.message.split(' ').at(1) + ' is now admin in the channel'})
				this.messageToOtherClient(Message.message.split(' ').at(1), 'chatNotif', {msg:'You are now admin for the channel '+ Message.dest})
			}
			if (resp === 1)
				client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' is already admin'})
			if (resp === 2)
				client.emit('chatNotifError', {msg:'Canno\'t find ' + Message.message.split(' ').at(1)})
		}
		else
		client.emit('chatNotifError', {msg:'You need to be admin to do that'})
	}
	else{
		client.emit('chatNotifError', {msg:"Unknow command: '"+Message.message+"'"})
	}
}

async normalMessage(client:Socket, Msg:Msg)
{
	// var room = await this.chatService.findRoomByName(Msg.dest)
	if (await this.chatService.isBanned(Msg.sender, Msg.dest) == false && await this.chatService.canTalk(Msg.sender, Msg.dest) === true){
		await this.chatService.addMessage(Msg)
		this.server.to(Msg.dest).emit('ReceiveMessage', Msg)
	}
	//else banned or muted
}

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, Message: {sender: string, dest: string, message: string, date: Date }) {
	if (Message.message.startsWith('/') )
		this.command(client, Message);
	else {
		this.normalMessage(client, Message);
	}
  }
}

