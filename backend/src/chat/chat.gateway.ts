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
    this.rooms = await this.chatService.getAllRoomName()
    this.chatService.create('general', 'system', "");
  }


  async handleConnection(client:Socket, ...args: any[]){
    this.logger.log("New Conection on the Chat!");
    client.join("general");
    console.log(client.handshake.query.token as string)
    var user = await this.userService.findOne(client.handshake.query.token as string)
    this.clients.set(client.id,new clientClass(client, user.token, user.login));
    client.emit('updateRooms',{rooms: this.rooms});
    client.emit('LoadRoom', {room: 'general', msg:await this.chatService.getMessagesByRoom('general')})
  }

  handleDisconnect(client: Socket) {
    this.logger.log("disconnected!");
  }

  @SubscribeMessage('getRoomList')
  roomList(client:Socket, data:any){
    client.emit('updateRooms',{rooms: this.rooms});
  }

  @SubscribeMessage('password')
  async password(client:Socket, data:any){
    var tocheck = await this.chatService.findRoomByName(data.room)

    // var decrypted = await this.chatService.decrypt(tocheck.password)
	console.log(tocheck.password + " " + data.pass);
    if (data.pass === tocheck.password)
    {
		console.log('icciiii')
      var msg = await this.chatService.getMessagesByRoom(data.room);
      client.emit('LoadRoom', {room: data.room, msg:msg })
      client.leave(this.clients.get(client.id)._room)
      client.join(data.room)
      this.clients.get(client.id)._room = data.room
    }
  }

  @SubscribeMessage('newRoom')
  async addRoom(client:Socket, data:any){
    if (data.password){
    //   var passEncrypt = await this.chatService.encrypt(data.password)
      var update = await this.chatService.create(data.name, data.creator, data.password);
    }
    else
      var update = await this.chatService.create(data.name, data.creator, '');
	this.loadRoom(client, data.name);
    this.server.emit('updateRooms',{rooms: update})
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client:Socket, data:any){
    var bool = await this.chatService.isAuthorized(this.clients.get(client.id)._token, data.room)
    var user = this.clients.get(client.id)._pseudo
    if(bool){
		if (await this.chatService.isBanned(user,data.room) == false){
      		var msg = await this.chatService.getMessagesByRoom(data.room);
      		client.emit('LoadRoom', {room: data.room, msg:msg })
      		client.leave(this.clients.get(client.id)._room)
      		client.join(data.room)
     		this.chatService.addUser(user, data.room)
			  this.clients.get(client.id)._room = data.room
		}
		else{
			//toast you ban
		}
    }
	else
      client.emit('needPassword', {room:data.room})
  }

  async loadRoom(client:Socket, roomName:string)
  {
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
async command(client: Socket,Message:Msg){
	var help = "/help will help you to know the command you can use from the library for multiple line and other shit like this for long text so cute "
	var unknow = "/ unknow command / try again..."
	
	
	
	if (Message.message.startsWith('/help'))
		client.emit('ReceiveMessage',{sender:'system' , dest:Message.dest, message: help, date: new Date()})
	else if (Message.message.startsWith('/delete')) {
		console.log("/delete")
		if(await this.chatService.isAdmin(Message.sender,Message.dest) == true)
			var ret = await this.chatService.deleteRoom(Message.dest)
		var rooms = await this.chatService.getAllRoomName();
		this.server.to(Message.dest).emit('deleted')
		this.server.emit('updateRooms', {rooms:rooms});
		console.log(ret)
		return ret;
	}
	else if (Message.message.startsWith("/ban")){
		if(await this.chatService.isAdmin(Message.sender,Message.dest) == true){
			await this.chatService.banUser(Message.message.split(' ').at(1), Message.dest)
			var socket = this.getUserByName(Message.message.split(' ').at(1))._socket
			this.loadRoom(socket, 'general')
		}
	}
	else if (Message.message.startsWith('/mute')){
		if(await this.chatService.isAdmin(Message.sender,Message.dest) == true){
			this.chatService.muteUser(Message)
		}
	}
	else if(Message.message.startsWith("/unban")){
		if(await this.chatService.isAdmin(Message.sender,Message.dest) == true)
			await this.chatService.unbanUsers(Message.message.split(' ').at(1), Message.dest)
		return;
	}
	else if (Message.message.startsWith('/setadmin')){
		if( await this.chatService.isAdmin(Message.sender, Message.dest) === true){
			return await this.chatService.addAdmin(Message.message.split(' ').at(1), Message.dest)
		}
	};
}

async normalMessage(client:Socket, Msg:Msg)
{
	await this.chatService.addMessage(Msg)
	this.server.to(Msg.dest).emit('ReceiveMessage', Msg)
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

