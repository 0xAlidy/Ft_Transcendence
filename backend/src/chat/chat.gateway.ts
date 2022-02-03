import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common'; 
import { clientClass } from "./class/client.class";
import { ChatRoomsService } from 'src/ChatRooms/ChatRooms.service';

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
    var passEncrypt = await this.chatService.encrypt(data.password)
    var update = await this.chatService.create(data.name, data.creator, passEncrypt);
    this.server.emit('updateRooms',{rooms: update})
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
      client.emit('needPassword', {room:data.room})
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, Message: { sender: string, dest: string, message: string, date: string}) {
    this.chatService.addMessage(Message);
    this.server.to(Message.dest).emit('ReceiveMessage', Message)
  }
}
