import { Logger } from "@nestjs/common";
import {OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { clientClass } from "src/game/class/client.class";
import { MatchsService } from "src/matchs/matchs.service";
import { User } from "src/user/user.entity";
import { UsersService } from "src/user/users.service";

@WebSocketGateway({cors: true})
export class NotifGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private userService: UsersService){
    }
    index:number = 0;
    private logger: Logger = new Logger('WS-notifications');
    clients = new Map<string, clientClass>();
    clientsSearching:clientClass[]= [];
    clientsOnWaitingRoom = new Map();
    @WebSocketServer()
    server: Server;

    getUserClassbyName(str:string):clientClass
    {
        var ret = null;
        this.clients.forEach( element => {
            console.log("foreach "+ element._login +" === " +str + " " + str.localeCompare(element._login));
            if( str.localeCompare(element._login) === 0){
                console.log('okay ' + element)
                ret = element;}
        })
        return ret
    }

    afterInit(server: any) {
        this.logger.log('Initialized!');
        this.logger.log('Waiting for incoming connection...');
    }

    async handleConnection(client: Socket, ...args: any[]) {
        var user = await this.userService.findOne(client.handshake.query.token as string);
        this.clients.set(client.id,new clientClass(client, user.login, user.token));
    }
    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
    }

    @SubscribeMessage('inviteFriend')
    async inviteFriend(client: Socket, data:any){
        console.log(data.login)
        var user = this.clients.get(client.id);
        var ret = await this.userService.addWaitingFriend(data.login, user._login)
       if (user && ret === 1)
        {
            var clientToNotify : clientClass = this.getUserClassbyName(data.login);
            if(clientToNotify)
                clientToNotify._socket.emit('inviteNotif', {login: user._login})
        }
        return null;
    }

    @SubscribeMessage('acceptFriend')
    async acceptFriend(client: Socket, data:any){
        console.log(data.login)
        var user = this.clients.get(client.id);
        this.userService.removeWaitingFriend(user._token, data.login)
        this.userService.addFriend(user._token, data.login)
    }

    @SubscribeMessage('denyFriend')
    async denyFriend(client: Socket, data:any){
        console.log(data.login)
        var user = this.clients.get(client.id);
        this.userService.removeWaitingFriend(user._token, data.login)
    }
}
