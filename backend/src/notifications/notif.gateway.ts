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

    getUserClassbyName(str:string):clientClass| null
    {
        this.clients.forEach( element => {
            if(element._login === str)
                return element;
        })
        return null
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
        var user = this.clients.get(client.id);
        var dbUser = await this.userService.findOneByLogin(data.login)
        dbUser.waitingFriends.push(data.login)
        await this.userService
       if (user)
        {
            var ret : clientClass;
            if(ret = this.getUserClassbyName(data.login))
            {
                ret._socket.emit('inviteNotif', {login: data.login})
            }
        }
        return null;
    }
}
