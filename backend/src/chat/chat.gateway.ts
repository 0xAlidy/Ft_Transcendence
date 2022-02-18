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
    console.log(bool)
    var user = this.clients.get(client.id)._pseudo
    if(bool){
      var msg = await this.chatService.getMessagesByRoom(data.room);
      client.emit('LoadRoom', {room: data.room, msg:msg })
      client.leave(this.clients.get(client.id)._room)
      client.join(data.room)
      this.chatService.addUser(user, data.room)
      this.clients.get(client.id)._room = data.room
    }
    else
      client.emit('needPassword', {room:data.room})
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, Message: { sender: string, dest: string, message: string, date: string}) {
    if (Message.message[0] == '/'){
        this.chatService.systemMsg(Message, this.clients);
        Message.sender = "system";
        if (Message.message.startsWith('/priv')){
          var rooms = await this.chatService.getAllRoomName; //todo /priv undifined 
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

