import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Room } from './class/Room.class';
import { clientClass } from "../game/class/client.class";
import { MessagesService } from 'src/message/messages.service';
// import { Message } from '../../../frontend/src/components/MainPage/Chat/Chat';

@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayInit {

  constructor(private readonly messagesService: MessagesService){
  }

  clients = new Map<string, clientClass>();

  @WebSocketServer() server: Server;

  rooms: Room[];
  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
    var general_room = new Room({name:"general", id:1});
    this.rooms = [general_room];
  }

  handleConnection(client:Socket, ...args: any[]){
    this.logger.log("New Conection !");
    client.join("general")
    this.clients.set(client.id,new clientClass(client));
  }

  handleDisconnect(client: Socket) {
    this.logger.log("disconnected!");
  }

  @SubscribeMessage('getRoomList')
  roomList(client:Socket, data:any){
    console.log(this.rooms);
    client.emit('sendRoomList',{rooms: this.rooms});
  }

  @SubscribeMessage('newConnection')
  addGeneral(client:Socket, data:any){
    this.rooms[0].userList.push(data.username);
    console.log(this.rooms);
  }

  @SubscribeMessage('newRoom')
  addRoom(client:Socket, data:any){
    var id = this.rooms.length + 1;
    var rr = new Room({name: data.name, id: id, creator: data.username, password: data.pass})
    if(this.findRoomByName(rr.name) == -1){
      this.rooms.push(rr);
      this.server.emit('sendRoomList',{rooms: this.rooms});
    }
    console.log(this.rooms);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client:Socket, data:any){
    if (data.room == data.oldRoom)
      return
    var roomJoined = data.room;
    var id = this.findRoomByName(roomJoined);
    console.log(roomJoined + " " + id + data.username );
    if (data.username && this.IsRoom(data.username, id) == 0)
      this.rooms[id].userList.push(data.username)
    console.log(this.IsRoom(data.username, id));
    this.server.emit('chatToClient', {sender:"[system]", room:roomJoined, message:data.username + " has joined your room"})

    // remove if he was connected to another room
    if (data.oldRoom)
      this.leaveRoom(client, data)
  }

  leaveRoom(client:Socket,data:any){
      var old = this.findRoomByName(data.oldRoom);
      if (old > -1)
        var old_id = this.rooms[old].userList.indexOf(data.username)
      if (old_id >= 0)
        this.rooms[old].userList.splice(old_id, 1);
      console.log( this.rooms[old].userList + "         fgsdfgsd");
      this.server.emit('chatToClient', {sender:"[system]", room: old, message:data.username + " has leave your room"})
  }

  IsRoom(username, id){
    for (var i = 0; i < this.rooms[id].userList.length; i++){
      if (this.rooms[id].userList[i] == username)
        return 1;
    }
    return 0;
  }

  findRoomByName(name){
    for (var i = 0; i < this.rooms.length; i++){
      if (this.rooms[i].name == name)
        return i;
    }
    return -1;
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, Message: { sender: string, dest: string, message: string, date: string}) {
    this.messagesService.create(Message.sender, Message.dest, Message.message, Message.date)
	  this.server.emit('refreshMsg', Message)
      //this.server.to(message.room).emit('chatToClient', message);
  }
}
