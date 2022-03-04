import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { clientClass } from "./class/client.class";
import { ChatRoomsService } from 'src/ChatRooms/ChatRooms.service';
import { Client } from 'socket.io/dist/client';
import { UsersService } from 'src/user/users.service';
import { Msg } from 'src/ChatRooms/Msg.dto';
import { v4 as uuidv4 } from 'uuid';


interface opt {
	value:string,
	label:string
}

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
	await this.updateRoom();
	this.loadRoom(client, 'general')
	this.setPlaceHolder(client, 'general')
  }

  handleDisconnect(client: Socket) {
    this.logger.log("disconnected!");
	var user = this.clients.get(client.id)
	if (user)
		this.clients.delete(client.id);
  }

  @SubscribeMessage('getRoomList')
  async roomList(client:Socket, data:any){
	await this.updateRoom();
  }
//   @SubscribeMessage('blockUserChat')
//   async blockUser(client: Socket, data:any){
// 	  var other = this.getUserByName(data.login);
// 	  var user = this.clients.get(client.id);
// 	  var room;
// 		await this.loadRoom(user._socket, 'general')
// 		await this.setPlaceHolder(user._socket, 'general')
// 		await this.chatService.deletePrivFromLogins(other._pseudo, user._pseudo)
// 		await this.updateRoom()
//   }

//   @SubscribeMessage('unblockUserChat')
//   async unblockUser(client: Socket, data:any){
// 	var other = this.getUserByName(data.login);

// 		await this.loadRoom(client, 'general')
// 		await this.setPlaceHolder(client, 'general')
// 	}

	refreshFrontBySocket(socket:Socket, login:string) {
		if (socket)
			socket.emit('refreshUser', {login: login});
	}

	@SubscribeMessage('removeFriend')
    async removeFriend(client: Socket, data:any){
        var user = this.clients.get(client.id);
        await this.userService.removeFriend(user._token, data.login)
        if (this.getUserByName(data.login))
        {
            this.refreshFrontBySocket(this.getUserByName(data.login)._socket, user._pseudo);
            this.refreshFrontBySocket(this.getUserByName(data.login)._socket, data.login);
        }
        this.refreshFrontBySocket(client, data.login);
        this.refreshFrontBySocket(client, user._pseudo);
    }

    @SubscribeMessage('denyFriend')
    async denyFriend(client: Socket, data:any){
        var user = this.clients.get(client.id);
		await this.userService.removeWaitingFriend(user._token, data.login)
		user._socket.emit('closeInviteFriend', {login: data.login})
		if (this.getUserByName(data.login))
        	this.refreshFrontBySocket(this.getUserByName(data.login)._socket, user._pseudo);
        //this.refreshFrontBySocket(client, data.login);
    }

	async denyFriendHL(login:string, otherLogin:string)
	{
		var other = await this.userService.findOneByLogin(login);
		await this.userService.removeWaitingFriend(other.token, otherLogin)
	}

	@SubscribeMessage('blockUser')
    async blockUser(client: Socket, data:any){
        var other = this.getUserByName(data.login);
        var user = this.clients.get(client.id);
        // await this.chatService.deletePrivFromLogins(data.login, user._login)
        await this.removeFriend(client, data);
        await this.denyFriend(client, data);
		if (other)
        	await this.denyFriend(other._socket, {login: user._pseudo});
		else
			this.denyFriendHL(data.login, user._pseudo);
        await this.userService.addBlocked(user._token, data.login);
        if (other)
            this.refreshFrontBySocket(other._socket, user._pseudo);
        this.refreshFrontBySocket(client, data.login);
        this.refreshFrontBySocket(client, user._pseudo);
		setTimeout(async () => { 
			await this.loadRoom(user._socket, 'general')
			await this.setPlaceHolder(user._socket, 'general')
			await this.chatService.deletePrivFromLogins(other._pseudo, user._pseudo)
			await this.updateRoom()
		}, 1000);
    }

	@SubscribeMessage('unblockUser')
    async unblockUser(client: Socket, data:any){
        var other = this.getUserByName(data.login);
        var user = this.clients.get(client.id);
        await this.userService.removeBlocked(user._token, data.login);
        if (this.getUserByName(data.login))
            this.refreshFrontBySocket(this.getUserByName(data.login)._socket, user._pseudo);
        this.refreshFrontBySocket(client, data.login);
        this.refreshFrontBySocket(client, user._pseudo);
		setTimeout(async () => { 
			await this.loadRoom(user._socket, user._room)
			await this.setPlaceHolder(user._socket, user._room)
			await this.chatService.deletePrivFromLogins(other._pseudo, user._pseudo)
			await this.updateRoom()
		}, 1000);
    }

	@SubscribeMessage('password')
	async password(client:Socket, data:any){
		var room = await this.chatService.findRoomByName(data.room)
		var cli = this.clients.get(client.id);
		if (data.pass === room.password)
		{
			await this.loadRoom(client, data.room)
			this.chatService.addUser(cli._pseudo,data.room)
			this.setPlaceHolder(client, data.room)
			client.leave(cli._room)
			client.join(data.room)
			cli._room = data.room
   		}
  }

  @SubscribeMessage('cancelPass')
  async cancelPass(client:Socket, data:any){
	  this.loadRoom(client,'general')
	  this.setPlaceHolder(client,'general')
  }


  @SubscribeMessage('newRoom')
  async addRoom(client:Socket, data:any){
    if (data.password){
    	await this.chatService.create(data.name, data.creator, data.password);
    }
    else
		await this.chatService.create(data.name, data.creator, '');
	await this.updateRoom();
	this.loadRoom(client, data.name);
	this.setPlaceHolder(client, data.name)
}


	async setPlaceHolder (client:Socket, room:string){
		var ret:string = "";
		console.log("'"+room+"'");
		if(room.startsWith('-'))
		{
			var parse = room.split('-').at(1)
				if (parse)
					var nick = await this.userService.findOneByLogin(parse.split(' ').at(0))
				var nickOther = await this.userService.findOneByLogin(room.split('/').at(1))
				if (nick && nickOther){
					var user = await this.userService.findOneByLogin(this.clients.get(client.id)._pseudo)
					if (user){
						console.log(nick+ " " + nickOther + " "+ user.nickname)
						if (user.nickname === nick.nickname)
							ret = nickOther.nickname
						else
							ret = nick.nickname
					}
					client.emit('placeHolder', {name:ret})
				}
		}
		else
			client.emit('placeHolder', {name:room})

	}

  @SubscribeMessage('joinRoom')
  async joinRoom(client:Socket, data:any){
    var bool = await this.chatService.isAuthorized(this.clients.get(client.id)._token, data.room)
    var user = this.clients.get(client.id)
    if(bool){
		if (await this.chatService.isBanned(user._pseudo,data.room) == false){
			  var msg = await this.chatService.getMessagesByRoom(data.room);
			this.loadRoom(client, data.room)
			this.setPlaceHolder(client, data.room)
     		this.chatService.addUser(user._pseudo, data.room)
		}
		else{
				client.emit('chatNotifError', {msg:'You are ban from ' +data.room + "!"})
		}
    }
	else{
		client.leave(user._room)
      	client.emit('needPassword', {room:data.room})
	}
  }
  async loadRoomAll(roomName:string, moveRoom:string)
  {
		var room = await this.chatService.findRoomByName(roomName);
		if (room && room.users){
			room.users.forEach((value) =>{
	  			var user = this.getUserByName(value)
				if (user)
				{	
					if (user._room !== "")
						user._socket.leave(user._room);
					user._socket.join(moveRoom)
					this.setPlaceHolder(user._socket, moveRoom)
					this.loadRoom(user._socket, moveRoom)
				}
			})
		}
  }

  async loadRoom(client:Socket, roomName:string)
  {
	  var user = this.clients.get(client.id);
	  if (user._room !== "")
	  user._socket.leave(user._room);
	  user._socket.join(roomName)
	  user._room = roomName;
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
	var resp = 0;

	//nombre d arguments
	var numArg = Message.message.split(' ').length
	if (Message.message[Message.message.length - 1] === ' ')
		numArg -= 1;

	//getLogin by nickname
	if (Message.message.split(' ').at(1) && numArg > 1)
		var login = await this.userService.getLoginByNickname(Message.message.split(' ').at(1));
	console.log(login);


	//desactiver command dans les privRoom
	var room = await this.chatService.findRoomByName(Message.dest)
    var isPriv = room.IsPrivate


	if (Message.message.startsWith('/help'))
		client.emit('ReceiveMessage',{sender:'system' , dest:Message.dest, message: help, date: new Date()})
	else if (Message.message.startsWith("/delete password")){
		if (numArg === 2){
			if(await this.chatService.isOwner(Message.sender,Message.dest) == true)
				if (await this.chatService.removePass(Message.dest))
					client.emit('chatNotif', {msg:'the password has been removed'})
				else
					client.emit('chatNotifError', {msg:'error'})
				}
		else
			client.emit('chatNotifError', {msg:'Wrong number of arguments'})
	}
	else if (Message.message.startsWith('/delete')) {
		console.log("/delete")
		if (numArg === 1){
			if(await this.chatService.isOwner(Message.sender,Message.dest) == true || isPriv === true){
				var user = this.getUserByName(Message.sender)
				await this.loadRoomAll(user._room,'general')
				if(await this.chatService.deleteRoom(Message.dest) === 0){
					this.server.to(Message.dest).emit('chatNotif',{msg:'the room' + Message.dest + 'has been deleted, you are now logged to general'})
					await this.updateRoom();
				}
				else
					client.emit('chatNotifError', {msg:'Canno\'t find ' + Message.dest})

			}
			else
				client.emit('chatNotifError', {msg:'You need to be owner to do that'})
		}
		else
			client.emit('chatNotifError', {msg:'Wrong number of arguments'})

	}
	else if (isPriv === false){
		 if (Message.message.startsWith("/ban")){
			if (numArg === 2){
				if(await this.chatService.isAdmin(Message.sender,Message.dest) == true){
					resp = await this.chatService.banUser(login, Message.dest)
					if (resp === 0){
						client.emit('chatNotif', {msg:Message.message.split(' ').at(1) + 'is now banned'})
						this.loadRoom(this.getUserByName(login)._socket, 'general')
						this.setPlaceHolder(client,'general')
						this.messageToOtherClient(login, 'chatNotifError', {msg:'You are now banned for the channel '+ Message.dest})
					}
					if (resp === 1)
						client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' is already banned'})
					if (resp === 2)
						client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' doesn\'t exist'})
					if (resp === 3)
						client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' doesn\'t exist'})
				}
				else
					client.emit('chatNotifError', {msg:'You need to be admin to do that'})
			}
			else
				client.emit('chatNotifError', {msg:'Wrong number of arguments'})
		}
		else if (Message.message.startsWith('/mute')){
			if (numArg === 3){
				if(await this.chatService.isAdmin(Message.sender,Message.dest) == true){
					resp = await this.chatService.muteUser(Message, login)
					if (resp === 0){
						client.emit('chatNotif', {msg:Message.message.split(' ').at(1) + 'is now muted'})
						this.messageToOtherClient(login, 'chatnote', {msg:'You are now muted for '+ Message.message.split(' ').at(2) + 'min'})
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
			else
				client.emit('chatNotifError', {msg:'Wrong number of arguments'})
		}
		else if(Message.message.startsWith("/unban")){
			if (numArg === 2){
				if(await this.chatService.isAdmin(Message.sender,Message.dest) == true){
					resp = await this.chatService.unbanUsers(login, Message.dest)
					if (resp === 0){
						client.emit('chatNotif', {msg:Message.message.split(' ').at(1) + 'is not unban'})
						this.messageToOtherClient(login, 'chatnote', {msg:'You are now unban in the channel '+ Message.dest})
					}
					if (resp === 1)
						client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + 'is not ban'})
					if (resp === 2)
						client.emit('chatNotifError', {msg:'error'})
				}
				else
					client.emit('chatNotifError', {msg:'You need to be admin to do that'})
			}
			else
				client.emit('chatNotifError', {msg:'Wrong number of arguments'})
		}
		else if(Message.message.startsWith("/password")){
			if (numArg === 2){
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
			else
				client.emit('chatNotifError', {msg:'Wrong number of arguments'})
		}
		else if (Message.message.startsWith('/setadmin')){
			if (numArg == 2){
				if( await this.chatService.isAdmin(Message.sender, Message.dest) === true){
					resp = await this.chatService.addAdmin(login, Message.dest)
					if (resp === 0){
						client.emit('chatNotif', {msg: Message.message.split(' ').at(1) + ' is now admin in the channel'})
						this.messageToOtherClient(login, 'chatNotif', {msg:'You are now admin for the channel '+ Message.dest})
					}
					if (resp === 1)
						client.emit('chatNotifError', {msg:Message.message.split(' ').at(1) + ' is already admin'})
					if (resp === 2)
						client.emit('chatNotifError', {msg:'Canno\'t find ' + Message.message.split(' ').at(1)})
				}
			}
			else
				client.emit('chatNotifError', {msg:'Wrong number of arguments'})
		}
		else{
			client.emit('chatNotifError', {msg:"Unknow command: '"+Message.message+"'"})
		}
	}
	else
		client.emit('chatNotifError', {msg:"you can't do this in private room"})
}

async normalMessage(client:Socket, Msg:Msg)
{
	if (await this.chatService.isBanned(Msg.sender, Msg.dest) == false){
		if (await this.chatService.canTalk(Msg.sender, Msg.dest) === true){
			Msg.uuid = uuidv4()
			await this.chatService.addMessage(Msg)
			this.server.to(Msg.dest).emit('ReceiveMessage', Msg)
		}
		else
			client.emit('chatNotifError', {msg:'Can\'t send message cause you are muted'})
	}
	else
		client.emit('chatNotifError', {msg:'Can\'t send message cause you are banned'})
	//else banned or muted
}





















async updateRoom(){
	var rooms = await this.chatService.getAllRoomName();
	var pub:opt[] = [];
	var priv:opt[] = [];
	var grouped = [];
	for (const element of rooms) {
		var room = await this.chatService.findRoomByName(element)
		if (room.IsPrivate == false)
			pub.push({value:element,label:element})
		else{
			var parse = room.name.split('-').at(1)
			var login1 = await this.userService.getNickame(parse.split(' ').at(0))
			var loginOther = await this.userService.getNickame(room.name.split('/').at(1))
			var label = "-" + login1 + " /" + loginOther
			priv.push({value:element,label:label})
		}
	}
	grouped = [{label: "Room", options:pub}, {label:"priv", options:priv}];

	this.server.emit('updateRooms',{rooms: grouped})
}

@SubscribeMessage('chatPrivate')
async chatPriv(client:Socket, data:any){
		var room = await this.chatService.privExist(data.name,data.other);
		if(room){
			await this.loadRoom(client,room.name)
			this.setPlaceHolder(client, room.name)
		}
		else{
			room = await this.chatService.addPriv(data.name,data.other)
			await this.updateRoom();
			await this.loadRoom(client,room.name)
			this.setPlaceHolder(client, room.name)
			client.emit('chatNotif', {msg:'You start a new private conversation with ' + data.name})
			this.messageToOtherClient(data.name, 'chatNotif', {msg:data.other + " has start a new private conversation with you"})
		}
}



@SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, Message: {uuid:string, sender: string, dest: string, message: string, date: Date }) {
	if (Message.message.startsWith('/') )
		this.command(client, Message);
	else {
		this.normalMessage(client, Message);
	}
  }
}

