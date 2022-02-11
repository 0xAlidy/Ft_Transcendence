import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common'; 
import { clientClass } from "./class/client.class";
import { ChatRoomsService } from 'src/ChatRooms/ChatRooms.service';
import { PrivRoomService } from 'src/PrivRoom/PrivRoom.service';

@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayInit {

  constructor(private readonly chatRoomService: ChatRoomsService, private readonly chatPrivService:PrivRoomService ){
  }
  clients = new Map<string, clientClass>();
  rooms: string[];
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  async afterInit(server: any) {
    this.logger.log('Initialized!');
    this.rooms = await this.chatRoomService.getAllRoomName()
    this.chatRoomService.create('general', 'system', '');
  }


  async handleConnection(client:Socket, ...args: any[]){
    this.logger.log("New Conection ! token:" + client.handshake.query.token);
    client.join("general");
    this.clients.set(client.id,new clientClass(client, client.handshake.query.token as string, client.handshake.query.username as string));
    client.emit('LoadRoom', {room: 'general', msg:await this.chatRoomService.getMessagesByRoom('general')})
    client.emit('updateRooms',{rooms: this.rooms});
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
    var tocheck = await this.chatRoomService.findRoomByName(data.room)
    var decrypted = await this.chatRoomService.decrypt(tocheck.password)
    if (data.pass === decrypted)
    {
      var msg = await this.chatRoomService.getMessagesByRoom(data.room);
      client.emit('LoadRoomPass', {room: data.room, msg:msg })
      client.leave(this.clients.get(client.id)._room)
      client.join(data.room)
      this.clients.get(client.id)._room = data.room 
    }
  }

  @SubscribeMessage('newRoom')
  async addRoom(client:Socket, data:any){
    if (data.password){
      var passEncrypt = await this.chatRoomService.encrypt(data.password)
      var update = await this.chatRoomService.create(data.name, data.creator, passEncrypt);
    }
    else
      var update = await this.chatRoomService.create(data.name, data.creator, '');
    this.server.emit('updateRooms',{rooms: update})
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client:Socket, data:any){
    var bool = await this.chatRoomService.isAuthorized(this.clients.get(client.id)._token, data.room)
    console.log(bool)
    var user = this.clients.get(client.id)._pseudo
    if(bool){
      var msg = await this.chatRoomService.getMessagesByRoom(data.room);
      client.emit('LoadRoom', {room: data.room, msg:msg })
      client.leave(this.clients.get(client.id)._room)
      client.join(data.room)
      this.chatRoomService.addUser(user, data.room)
      this.clients.get(client.id)._room = data.room
    }
    else
      client.emit('needPassword', {room:data.room})
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, Message: { sender: string, dest: string, message: string, date: string}) {
    console.log(Message)
    if (Message.message[0] == '/'){
        Message.message = await this.chatRoomService.systemMsg(Message, this.clients);
        Message.sender = "system";
        client.emit('ReceiveMessage', Message)
      }
      else{
        this.chatRoomService.addMessage(Message);
        this.server.to(Message.dest).emit('ReceiveMessage', Message)
      }
  }
}

