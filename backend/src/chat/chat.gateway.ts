import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Room } from './class/Room.class';
import { clientClass } from "./class/client.class";
import { MessagesService } from 'src/message/messages.service';
import { ChatRoomsService } from 'src/ChatRooms/ChatRooms.service';
// import { Message } from '../../../frontend/src/components/MainPage/Chat/Chat';

@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayInit {

  constructor(private readonly chatService: ChatRoomsService){
  }
  clients = new Map<string, clientClass>();
  rooms: string[];
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  async afterInit(server: any) {
    this.logger.log('Initialized!');
    this.rooms = await this.chatService.getAllRoomName()
    this.chatService.create('general', 'system', null);
  }

  async handleConnection(client:Socket, ...args: any[]){
    this.logger.log("New Conection ! token:" + client.handshake.query.token);
    client.join("general");
    this.clients.set(client.id,new clientClass(client, client.handshake.query.token as string));
    client.emit('updateRooms',{rooms: this.rooms});
    client.emit('LoadRoom', {room: 'general', msg:await this.chatService.getMessagesByRoom('general')})
  }

  handleDisconnect(client: Socket) {
    this.logger.log("disconnected!");
  }

  @SubscribeMessage('getRoomList')
  roomList(client:Socket, data:any){
    console.log(this.rooms);
    client.emit('updateRooms',{rooms: this.rooms});
  }

  // @SubscribeMessage('getMessage')
  // getMessage(client:Socket, data:any){
  //   this.rooms
  // }

  // @SubscribeMessage('changeRoom')
  // async askAuthorization(client:Socket, data:any){
  //   if(this.chatService.isAuthorized(this.clients.get(client.id)._token, data.name))
  //     client.emit('LoadRoom', await this.chatService.getMessagesByRoom('general'))
  //   else
  //     client.emit('needPassword')
  // }


  @SubscribeMessage('password')
  async password(client:Socket, data:any){
    


    //loadroom
  }

  // @SubscribeMessage('newConnection')
  // addGeneral(client:Socket, data:any){
  //   this.rooms[0].userList.push(data.username);
  //   console.log(this.rooms);
  // }

  @SubscribeMessage('newRoom')
  async addRoom(client:Socket, data:any){
    // console.log( data)
    var update = await this.chatService.create(data.name, data.creator, data.password);
    console.log(update);
    this.server.emit('updateRooms',{rooms: update})
    // var id = this.rooms.length + 1;
    // var rr = new Room(data.name, id, data.username, data.pass, this.server.to(data.name))
    // if(this.findRoomByName(rr.name) == -1){
    //   this.rooms.push(rr);
    //   this.server.emit('sendRoomList',{rooms: this.rooms});
    // }
    // console.log(this.rooms);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client:Socket, data:any){
    var bool = await this.chatService.isAuthorized(this.clients.get(client.id)._token, data.room)
    console.log(bool)
    if(bool){
    var msg = await this.chatService.getMessagesByRoom(data.room);
      client.emit('LoadRoom', {room: data.room, msg:msg })
      client.leave(this.clients.get(client.id)._room)
      client.join(data.room)
      this.clients.get(client.id)._room = data.room
    }
    else
      client.emit('needPassword')
  }


  // IsRoom(username, id){
  //   for (var i = 0; i < this.rooms[id].userList.length; i++){
  //     if (this.rooms[id].userList[i] == username)
  //       return 1;
  //   }
  //   return 0;
  // }

  // findRoomByName(name){
  //   for (var i = 0; i < this.rooms.length; i++){
  //     if (this.rooms[i].name == name)
  //       return i;
  //   }
  //   return -1;
  // }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, Message: { sender: string, dest: string, message: string, date: string}) {
    this.chatService.addMessage(Message);//save to db
    this.server.to(Message.dest).emit('ReceiveMessage', Message)
    // if (this.findRoomByName(Message.dest) !== -1)
    //   this.rooms[this.findRoomByName(Message.dest)]//.Send(Message.sender, Message.dest, Message.message, Message.date)
      //this.server.to(message.room).emit('chatToClient', message);
  }
}
