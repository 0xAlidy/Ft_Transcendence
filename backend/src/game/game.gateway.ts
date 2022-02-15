import { Logger } from "@nestjs/common";
import {OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MatchsService } from "src/matchs/matchs.service";
import { User } from "src/user/user.entity";
import { UsersService } from "src/user/users.service";
import { clientClass } from "./class/client.class";
import { roomClass } from "./class/room.class";

@WebSocketGateway({cors: true})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private userService: UsersService,private readonly matchsService: MatchsService){
    }
    index:number = 0;
    private logger: Logger = new Logger('WS-game');
    rooms = new Map<string, roomClass>() ;
    i : number;
    clients = new Map<string, clientClass>();
    clientsSearching:clientClass[]= [];
    clientsOnWaitingRoom = new Map();
    @WebSocketServer()
    server: Server;


    afterInit(server: any) {
        this.logger.log('Initialized!');
        this.logger.log('Waiting for incoming connection...');
    }

    async handleConnection(client: Socket, ...args: any[]) {
        var user = await this.userService.findOne(client.handshake.query.token as string);
        this.logger.log("Connection:    " + client.id.slice(0, 4));
        this.clients.set(client.id,new clientClass(client, user.login, user.token));
    }
    nicknameChange(){

    }
    handleDisconnect(client: Socket) {
        this.logger.log("Disconnect:    "+ client.id.slice(0, 4));
        if (this.clients.get(client.id))
        {
            this.userService.changeWSId(this.clients.get(client.id)._login, 'null');
            this.userService.setIsActive(this.clients.get(client.id)._login, false);
            var roomtoleave : string = this.clients.get(client.id)._room;
            if(roomtoleave !== 'lobby')
            {
                this.abandon(client);
            }
        }
        this.clients.delete(client.id);
    }

    getUserClassbyName(str:string):clientClass| null
    {
        this.clients.forEach( element => {
            if(element._login === str)
                return element;
        })
        return null
    }

    @SubscribeMessage('createPrivateSession')
    createPrivateSession(client: Socket, data: any){
        var cli = this.clients.get(client.id);
        var guest = this.getUserClassbyName(data.inviteName);
        this.rooms.set('room' +this.index, new roomClass(data.clientName + data.inviteName, cli , guest, this.server.to(data.clientName + data.inviteName)));
        guest._socket.emit('invite', {adv:cli._login, room:data.clientName + data.inviteName})
    }

    @SubscribeMessage('joinPrivateSession')
    joinPrivateSession(client: Socket, data: any){
        var room = this.rooms.get(data.room)
        room._player._room = data.room;
        room._guest._room = data.room;
        var room = this.rooms.get('room' + this.index);
        room._player._socket.leave('lobby');
        room._player._socket.join(data.room);
        room._guest._socket.leave('lobby');
        room._guest._socket.join(data.room);
        room._player._socket.emit('startGame', {id: 1, room: data.room, nameA: room._player._login, nameB: room._guest._login})
        room._guest._socket.emit('startGame', {id: 2, room: data.room, nameA: room._player._login, nameB: room._guest._login});
        room._isJoinable = false;
        this.index++;
    }


    @SubscribeMessage('searchRoom')
    search(client: Socket): void {
        this.clientsSearching.push(this.clients.get(client.id))
        console.log(this.clients.get(client.id)._login + 'join waiting match')
        client.emit('changeState', {bool : true})
        if (this.clientsSearching.length == 2)
        {
            var userOne = this.clientsSearching.at(1)
            var userTwo = this.clientsSearching.at(0)
            this.clientsSearching.pop()
            this.clientsSearching.pop()
            var roomName = "room"+this.index;
            userOne._room = roomName;
            userTwo._room = roomName;
            this.rooms.set('room' +this.index, new roomClass(roomName, userOne , userTwo, this.server.to(roomName)));
            var room = this.rooms.get('room' + this.index);
            userOne._socket.leave('lobby');
            userOne._socket.join(roomName);
            userTwo._socket.leave('lobby');
            userTwo._socket.join(roomName);
            this.rooms.get('room' + this.index)._player._socket.emit('startGame', {id: 1, room: roomName, nameA: room._player._login, nameB: room._guest._login})
            this.rooms.get('room' + this.index)._guest._socket.emit('startGame', {id: 2, room: roomName, nameA: room._player._login, nameB: room._guest._login});
            room._isJoinable = false;
            this.index++;
        }
    }
    // @SubscribeMessage('createRoom')
    // createRoom(client: Socket): void {
    //     if (this.clients.get(client.id)._room !== this.clients.get(client.id)._login + "'s_room"){
    //         var formated : string = this.clients.get(client.id)._login + "'s_room";
    //         this.clients.get(client.id).setRoom(formated);
    //         this.rooms.set(formated, new roomClass(formated, this.clients.get(client.id), this.server.to(formated)));
    //         this.updateRoom();
    //     }
    //     else{
    //     }
    // }
    @SubscribeMessage('getUserName')
    userName(client: Socket): void {
        var formated : string = this.clients.get(client.id)._login + "'s_room";
        var ret = this.clients.get(client.id)._login;
        client.emit('username', {username: ret})
        this.updateRoom();
    }
    @SubscribeMessage('specRoom')
    specRoom(client: Socket, data: any ): void {
        var room = this.rooms.get(data.room)
                client.leave('lobby');
                client.join(room._name);
                room.addGuest(this.clients.get(client.id));
                this.clients.get(client.id).setRoom(room._name);
                client.emit('startGame', {id: 3, room: room, nameA: room._player._login, nameB: room._guest._login});
                this.updateRoom();
    }
    @SubscribeMessage('joinRoom')
    joinRoom(client: Socket, room: string ): void {
        this.rooms.forEach(element => {
            if (element._name == room && !element._isJoinable)
            {
                element._player._socket.leave('lobby');
                element._player._socket.join(element._name);
                client.leave('lobby');
                client.join(element._name);
                element.addSpec(this.clients.get(client.id));
                this.clients.get(client.id).setRoom(room);
                client.emit('startGame', {id: 3, room: room, nameA: element._player._login, nameB: element._guest._login});
                this.updateRoom();
            }
            if(element._name == room && element._isJoinable)
            {
                element._player._socket.leave('lobby');
                element._player._socket.join(element._name);
                client.leave('lobby');
                client.join(element._name);
                element.addGuest(this.clients.get(client.id));
                this.clients.get(client.id).setRoom(room);
                element._player._socket.emit('startGame', {id: 1, room: room, nameA: element._player._login, nameB: element._guest._login})
                client.emit('startGame', {id: 2, room: room, nameA: element._player._login, nameB: element._guest._login});
                element._isJoinable = false;
                this.updateRoom();
            }
        });
    }
    @SubscribeMessage('cancel')
    cancelSearch(client: Socket): void {
        var index = this.clientsSearching.indexOf(this.clients.get(client.id))
        console.log(this.clients.get(client.id)._login + 'leave waiting match')
        client.emit('changeState', {bool : false})
        if (index > -1) {
            this.clientsSearching.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    @SubscribeMessage('end')
    abandon(client: Socket): void {
        var user = this.clients.get(client.id);
        var room = this.rooms.get(this.clients.get(client.id)._room);
        if (room)
        {
		room._room.emit('closeGame');
        var ret = room.abandon(user._login)
        console.log(room._guest._token + "   " + room._player._token)
        if (ret == 1){
            this.userService.win(room._guest._token);
            this.userService.xp(room._guest._token, 50);
            this.matchsService.create(room._guest._login, 5, room._player._login, room._scoreA);
        }if (ret == 2){
            this.userService.win(room._player._token);
            this.userService.xp(room._player._token, 50);
            this.matchsService.create(room._player._login, 5, room._guest._login, room._scoreB);
        }
        this.rooms.delete(room._name);
        this.updateRoom();}
        // l'adversaire gagne le match
        // match history winner = 5 pts
        //
    }
    @SubscribeMessage('waiting')
        waitingMsg(client: Socket): void {
            client.emit('me', this.clients.get(client.id)._login)
            this.userService.setIsActive(this.clients.get(client.id)._token, true);
            this.clients.get(client.id)._room = 'lobby'
            client.join('lobby');
            this.logger.log('salut');
            this.updateRoom();
    }
    @SubscribeMessage('ready')
        ready(client: Socket, data : any): void {
            this.rooms.forEach(element => {
                if(element._name == data.room)
                {
                    this.logger.log("ready!"+ data.id);
                    element.setReady(data.id);
                }
            });
    }
    @SubscribeMessage('playerMovement')
    PlayerMovement(client: Socket, data: any): void {
        this.rooms.forEach(element => {
            if(element._name == data.room)
                element.UpdatePos(data.id, data.y);
        });
    }
    @SubscribeMessage('ball')
    ballUpdate(client: Socket, data: any): void {
        this.rooms.forEach(element => {
            if(element._name == data.room){
                element.ballUpdate(data);
            }
        });
    }

    @SubscribeMessage('score')
    Score(client: Socket, data: any): void {
                var room = this.rooms.get(data.room)
                var res = room.goal(data.goalID)
                if(res!= 0)
                {
                    if(res == 1)
                    {

                        room._player._socket.emit('popupScore', {win: true, adv:room._guest._login})
                        room._guest._socket.emit('popupScore', {win: false, adv:room._player._login})
                        this.userService.win(room._player._token);
                        this.userService.xp(room._player._token, 50);
                        this.userService.xp(room._guest._token, 25);
                        this.userService.loose(room._guest._token);
                        this.matchsService.create(room._player._login, 5, room._guest._login, room._scoreB);
                    }
                    if(res == 2)
                    {
                        room._player._socket.emit('popupScore', {win: false, adv:room._player._login})
                        room._guest._socket.emit('popupScore', {win: true, adv:room._guest._login})
                        this.userService.win(room._guest._token);
                        this.userService.xp(room._player._token, 25);
                        this.userService.xp(room._guest._token, 50);
                        this.userService.loose(room._player._token);
                        this.matchsService.create(room._guest._login, 5, room._player._login, room._scoreA);
                    }
                    room.clean();
                }
    }

    updateRoom(){
        var spec : specRooms[] = [];

        this.rooms.forEach(element => {
            if (element._isJoinable == false)
                spec.push({name:element._name, left:element._player._login, right:element._guest._login});
        });
        this.server.to('lobby').emit('specRoom', {spec: spec});
    }
    //GAME-PART

}

interface specRooms{
    name:string,
    left:string,
    right:string,
}
