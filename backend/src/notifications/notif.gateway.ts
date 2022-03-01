import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { clientClass } from "src/game/class/client.class";
import { MatchsService } from "src/matchs/matchs.service";
import { User } from "src/user/user.entity";
import { UsersService } from "src/user/users.service";

@WebSocketGateway({cors: true})
export class NotifGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private userService: UsersService){}
	index: number = 0;
	private logger: Logger = new Logger('WS-notifications');
	clients = new Map<string, clientClass>();
	clientsSearching:clientClass[]= [];
	clientsOnWaitingRoom = new Map();
	@WebSocketServer()
	server: Server;

	getUserClassbyName(str: string): clientClass {
		var ret = null;
		this.clients.forEach(element => {
			if (str.localeCompare(element._login) === 0){
				ret = element;
			}
		})
		return ret;
	}

	refreshFrontAll(login:string){
		this.clients.forEach(element => {
			this.refreshFrontBySocket(element._socket, login);
		})
	}

	refreshFrontBySocket(socket:Socket, login:string) {
		if (socket)
			socket.emit('refreshUser', {login: login});
	}

	afterInit(server: any) { }

	async handleConnection(client: Socket, ...args: any[]) {
		// if (this.getUserClassbyName())
		var user = await this.userService.findOne(client.handshake.query.token as string);
		await this.userService.setStatus(user.token, 1);
		if (this.getUserClassbyName(user.login)){
            client.emit('caDegage');
            client.disconnect(true);
        }
		this.refreshFrontAll(user.login);
		this.clients.set(client.id, new clientClass(client, user.login, user.token));
	}

	async handleDisconnect(client: Socket) {
		var user = this.clients.get(client.id)
		if (user)
		{
			await this.userService.setStatus(user._token, 0);
			this.refreshFrontAll(user._login);
			this.clients.delete(client.id);
		}
	}

	@SubscribeMessage('refreshFrontAll')
	async refreshUser(client: Socket, data:any){
		this.refreshFrontAll(data.login);
	}

	@SubscribeMessage('inviteFriend')
	async inviteFriend(client: Socket, data:any) {
		var temp = this.clients.get(client.id);
		var user = await this.userService.findOne(temp._token);
		var other =  await this.userService.findOneByLogin(data.login);
		if (user.waitingFriends.indexOf(other.login) !== -1)
			await this.acceptFriend(client, data);
		else
		{
			await this.userService.addWaitingFriend(other.login, user.login)
			var clientToNotify : clientClass = this.getUserClassbyName(other.login);
			if (clientToNotify)
				clientToNotify._socket.emit('inviteNotif', {login: user.login});
		}
		if (this.getUserClassbyName(other.login))
			this.refreshFrontBySocket(this.getUserClassbyName(other.login)._socket, other.login);
		this.refreshFrontBySocket(client, other.login);
	}

	@SubscribeMessage('acceptFriend')
	async acceptFriend(client: Socket, data:any){
		var user = this.clients.get(client.id);
		await this.userService.addFriend(user._token, data.login)
		user._socket.emit('closeInviteFriend', {login: data.login})
		if (this.getUserClassbyName(data.login))
			this.refreshFrontBySocket(this.getUserClassbyName(data.login)._socket, data.login);
		this.refreshFrontBySocket(client, data.login);
	}

	@SubscribeMessage('removeFriend')
	async removeFriend(client: Socket, data:any){
		var user = this.clients.get(client.id);
		await this.userService.removeFriend(user._token, data.login)
		if (this.getUserClassbyName(data.login))
			this.refreshFrontBySocket(this.getUserClassbyName(data.login)._socket, data.login);
		this.refreshFrontBySocket(client, data.login);
	}

	@SubscribeMessage('denyFriend')
	async denyFriend(client: Socket, data:any){
		var user = this.clients.get(client.id);
		await this.userService.removeWaitingFriend(user._token, data.login)
		if (this.getUserClassbyName(data.login))
			this.refreshFrontBySocket(this.getUserClassbyName(data.login)._socket, data.login);
		this.refreshFrontBySocket(client, data.login);
	}

	@SubscribeMessage('blockUser')
	async blockUser(client: Socket, data:any){
		client.emit('removeFriend', {login:data.login});
		client.emit('denyFriend', {login:data.login})
		var user = this.clients.get(client.id);
		await this.userService.addBlocked(user._token, data.login)
		if (this.getUserClassbyName(data.login))
			this.refreshFrontBySocket(this.getUserClassbyName(data.login)._socket, data.login);
		this.refreshFrontBySocket(client, data.login);
	}

	@SubscribeMessage('unblockUser')
	async unblockUser(client: Socket, data:any){
		var user = this.clients.get(client.id);
		await this.userService.removeBlocked(user._token, data.login)
		if (this.getUserClassbyName(data.login))
			this.refreshFrontBySocket(this.getUserClassbyName(data.login)._socket, data.login);
		this.refreshFrontBySocket(client, data.login);
	}

	@SubscribeMessage('askHistoryOf')
	async askHistoryOf(client: Socket, data:any){
		client.emit('menuChange', {selector:'history'})
		client.emit('openHistoryOf', data)
	}

	@SubscribeMessage('askMenuChange')
	async askMenuChange(client: Socket, data:any){
		client.emit('menuChange', data)
	}
}
