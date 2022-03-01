import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { clientClass } from "./class/client.class";
import { ChatRoomsService } from 'src/ChatRooms/ChatRooms.service';
import { Client } from 'socket.io/dist/client';
import { UsersService } from 'src/user/users.service';

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
    var decrypted = await this.chatService.decrypt(tocheck.password)
    if (data.pass === decrypted)
    {
      var msg = await this.chatService.getMessagesByRoom(data.room);
      client.emit('LoadRoomPass', {room: data.room, msg:msg })
      client.leave(this.clients.get(client.id)._room)
      client.join(data.room)
      this.clients.get(client.id)._room = data.room
    }
  }

  @SubscribeMessage('newRoom')
  async addRoom(client:Socket, data:any){
    if (data.password){
      var passEncrypt = await this.chatService.encrypt(data.password)
      var update = await this.chatService.create(data.name, data.creator, passEncrypt);
    }
    else
      var update = await this.chatService.create(data.name, data.creator, '');
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
			var msg = await this.chatService.getMessagesByRoom("general")
			client.emit('LoadRoom', {room: "general", msg:msg })
			client.emit("banned");
		}
    }
	else
      client.emit('needPassword', {room:data.room})
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, Message: { sender: string, dest: string, message: string, date: string}) {

	if(await this.chatService.isBanned(Message.sender,Message.dest) == true)
		this.server.emit("banned")
	else{
		if (Message.message.startsWith('/priv')){
			Message.message = await this.chatService.addPriv(Message.message, Message.sender, this.clients, Message.dest);
			if (Message.message.startsWith("new")){
				console.log("update rooms")
				var rooms = await this.chatService.getAllRoomName();
				this.server.emit('updateRooms',{rooms: rooms})
			}
			Message.sender = "system";
			client.emit('ReceiveMessage', Message)
		}
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
    	else if (Message.message.startsWith('/') ){
    	    this.chatService.systemMsg(Message, this.clients);
			Message.sender = "system";
    	    if (Message.message.startsWith('/priv')){
				var rooms = await this.chatService.getAllRoomName(); //todo /priv undifined
				if (rooms)
    	        	this.server.emit('updateRooms',{rooms: rooms})
    	    }
    	    client.emit('ReceiveMessage', Message)
		}
    	else{
    	    this.chatService.addMessage(Message);
			this.server.to(Message.dest).emit('ReceiveMessage', Message)
		}
	}
  }
}

