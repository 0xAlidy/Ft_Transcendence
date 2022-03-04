import { Logger } from "@nestjs/common";
import {OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MatchsService } from "src/matchs/matchs.service";
import { User } from "src/user/user.entity";
import { UsersService } from "src/user/users.service";
import { threadId } from "worker_threads";
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
    clientsSearchingArcade:clientClass[]= [];
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
        client.join('lobby');
        this.clients.get(client.id)._room = 'lobby';
        this.updateRoom();
    }
    nicknameChange(){

    }
    handleDisconnect(client: Socket) {
        this.logger.log("Disconnect:    "+ client.id.slice(0, 4));
        var user = this.clients.get(client.id)
        this.deletePrivRoomByLogin(user._login)
        if (user)
        {
            var cs = this.clientsSearching.indexOf(user)
            var csa = this.clientsSearchingArcade.indexOf(user)
            if(cs !== -1)
                this.clientsSearching.splice(cs, 1);
            if(csa !== -1)
                this.clientsSearchingArcade.splice(csa, 1);
            this.userService.changeWSId(this.clients.get(client.id)._login, 'null');
            var roomtoleave : string = this.clients.get(client.id)._room;
            if(roomtoleave !== 'lobby')
            {
                this.abandon(client);
                this.userService.setStatus(this.clients.get(client.id)._token, 0)
            }

            this.deletePrivRoomByLogin(user._login)
        }
        this.clients.delete(client.id);
    }

    getUserClassbyName(str:string):clientClass| null
    {
        var ret = null;
        this.clients.forEach( element => {
            if(element._login === str)
                ret = element;
        })
        return ret
    }
    deletePrivRoomByLogin(login:string)
    {
        this.rooms.forEach((room) =>{
            console.log("guest:"+ room._guest._login +"  sender:" +room._player._login+ "    login:"+ login)
            if(room._name.startsWith('Privroom'))
            {
                if(room._guest._login === login || room._player._login === login)
                {
                    room._player._socket.emit('closeInviteNotif'+ room._guest._login );
                    room._guest._socket.emit('closeInviteNotif'+ room._player._login );
                    room._player._socket.emit('closePendingNotif');
                    room._guest._socket.emit('closePendingNotif');
                    this.rooms.delete(room._name)
                }
            }
        })
    }
    deletePrivRoomByLoginWithExeption(login:string,exept:string)
    {
        this.rooms.forEach((room) =>{
            console.log("guest:"+ room._guest._login +"  sender:" +room._player._login+ "    login:"+ login)
            if(room._name.startsWith('Privroom') && exept !== room._name)
            {
                if(room._guest._login === login || room._player._login === login)
                {
                    room._player._socket.emit('closeInviteNotif'+ room._guest._login );
                    room._guest._socket.emit('closeInviteNotif'+ room._player._login );
                    room._player._socket.emit('closePendingNotif');
                    room._guest._socket.emit('closePendingNotif');
                    this.rooms.delete(room._name)
                }
            }
        })
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

    @SubscribeMessage('cancelPrivate')
    cancelPrivate(client: Socket, data: any){
        var cli = this.clients.get(client.id);
        this.rooms.delete("Privroom"+cli._login)
        var guest = this.getUserClassbyName(data.login);
        if(guest){
            guest._socket.emit('closeInviteNotif'+cli._login);
        }
    }

    isInPrivateRoom(login:string){
        var ret = false;
        this.rooms.forEach(room => {
            if(room._name.startsWith('Privroom'))
            {
                if(room._guest._login === login || room._player._login === login)
                {
                    ret = true;
                }
            }
        });
        return ret;
    }

    @SubscribeMessage('createPrivateSession')
    createPrivateSession(client: Socket, data: any){
        var cli = this.clients.get(client.id);
        if(this.rooms.get("Privroom"+cli._login))
        {
            cli._socket.emit('chatNotifError',{msg: 'you are already pending for a match!'})
            return;
        }
        if(this.isInPrivateRoom(cli._login))
        {
            cli._socket.emit('chatNotifError',{msg: 'You have to accept/refuse the request!'})
            return;
        }
        console.log(data.login)
        var guest = this.getUserClassbyName(data.login);
        if(!guest){
            cli._socket.emit('chatNotifError',{msg: 'your friend is not connected!'})
            return
        }
        if(guest._isInvitable){
            cli._socket.emit('pendingInvite', {login:guest._login})
            guest._socket.emit('inviteDuel', {adv:cli._login, room:'Privroom' +cli._login})
            this.rooms.set('Privroom' +cli._login, new roomClass('Privroom' +cli._login, cli , guest, this.server.to('Privroom' +cli._login), data.arcade));
        }
        else
            cli._socket.emit('chatNotifError',{msg: 'your friend is already in a game!'})
    }

    @SubscribeMessage('denyDuel')
    denyDuel(client: Socket, data: any){
        if(this.rooms.get(data.room))
        {
            this.rooms.delete(data.room)
            var sender = this.getUserClassbyName(data.login);
            if(sender){
                sender._socket.emit('closePendingNotif');
            }
        }
        // var cli = this.clients.get(client.id);
        // console.log(data.login)
        // var guest = this.getUserClassbyName(data.login);
        // if(!guest){
        //     cli._socket.emit('chatNotifError',{msg: 'your friend is not connected!'})
        //     return
        // }
        // if(guest._isInvitable){
        //     cli._socket.emit('pendingInvite', {login:guest._login})
        //     guest._socket.emit('inviteDuel', {adv:cli._login, room:'Privroom' +this.index})
        //     this.rooms.set('Privroom' +this.index, new roomClass('Privroom' +this.index, cli , guest, this.server.to('Privroom' +this.index), data.arcade));
        // }
        // else
        //     cli._socket.emit('chatNotifError',{msg: 'your friend is already in a game!'})
        // this.index++;
    }
    deleteFromWaitingList(cli:clientClass){
        var idx = this.clientsSearching.indexOf(cli)
        var idxa = this.clientsSearchingArcade.indexOf(cli)
        if(idx !== -1)
            this.clientsSearching.splice(idx, 1)
        if(idxa !== -1)
            this.clientsSearchingArcade.splice(idx, 1)
    }

    @SubscribeMessage('joinPrivateSession')
    joinPrivateSession(client: Socket, data: any){
        var room = this.rooms.get(data.room)
        var cli = this.getUserClassbyName(room._player._login)
        var guest = this.getUserClassbyName(room._guest._login)
        this.deleteFromWaitingList(cli)
        this.deleteFromWaitingList(guest)
        this.deletePrivRoomByLoginWithExeption(cli._login, data.room)
        if(!cli || !guest)
            return;
        room._player._room = data.room;
        room._guest._room = data.room;
        room._player._socket.leave('lobby');
        room._player._socket.join(data.room);
        room._guest._socket.leave('lobby');
        room._guest._socket.join(data.room);
        this.userService.setInGameBylogin(room._player._login, 2);
        this.userService.setInGameBylogin(room._guest._login, 2);
        this.refreshFrontAll(room._player._login);
        this.refreshFrontAll(room._guest._login);
        room._player._socket.emit('startGame', {id: 1, room: data.room, nameA: room._player._login, nameB: room._guest._login, arcade:room._isArcade});
        room._guest._socket.emit('startGame', {id: 2, room: data.room, nameA: room._player._login, nameB: room._guest._login, arcade:room._isArcade});
        cli._isInvitable = false;
        guest._isInvitable = false;
        room._isJoinable = false;
    }

    @SubscribeMessage('searchArcade')
    async searchArcade(client: Socket){
        this.clientsSearchingArcade.push(this.clients.get(client.id))
        this.deletePrivRoomByLogin(this.clients.get(client.id)._login);
        console.log(this.clients.get(client.id)._login + 'join waiting match')
        client.emit('SearchStatus', {bool: true})
        if (this.clientsSearchingArcade.length == 2)
        {
            var userOne = this.clientsSearchingArcade.at(1)
            var userTwo = this.clientsSearchingArcade.at(0)
            this.clientsSearchingArcade.pop()
            this.clientsSearchingArcade.pop()
            var roomName = "arcade" + this.index;
            userOne._room = roomName;
            userTwo._room = roomName;
            this.rooms.set(roomName, new roomClass(roomName, userOne , userTwo, this.server.to(roomName), true));
            var room = this.rooms.get(roomName);
            userOne._socket.leave('lobby');
            userOne._socket.join(roomName);
            userTwo._socket.leave('lobby');
            userTwo._socket.join(roomName);
            room._room.emit('SearchStatus', {bool: false})
            await this.userService.setInGameBylogin(room._player._login, 2);
            await this.userService.setInGameBylogin(room._guest._login, 2);
            this.refreshFrontAll(room._player._login);
            this.refreshFrontAll(room._guest._login);
            room._player._socket.emit('startGame', {id: 1, room: roomName, nameA: room._player._login, nameB: room._guest._login, arcade:true})
            room._guest._socket.emit('startGame', {id: 2, room: roomName, nameA: room._player._login, nameB: room._guest._login, arcade:true});
            userOne._isInvitable = false;
            userTwo._isInvitable = false;
            room._isJoinable = false;
            this.index++;
            this.updateRoom();
        }
        else
            client.emit('pendingSearch');
    }

    @SubscribeMessage('searchRoom')
    async search(client: Socket){
        this.clientsSearching.push(this.clients.get(client.id))
        this.deletePrivRoomByLogin(this.clients.get(client.id)._login);
        console.log(this.clients.get(client.id)._login + 'join waiting match')
        client.emit('SearchStatus', {bool: true})
        if (this.clientsSearching.length == 2)
        {
            var userOne = this.clientsSearching.at(1)
            var userTwo = this.clientsSearching.at(0)
            this.clientsSearching.pop()
            this.clientsSearching.pop()
            var roomName = "room" + this.index;
            this.rooms.set(roomName, new roomClass(roomName, userOne , userTwo, this.server.to(roomName), false));
            var room = this.rooms.get(roomName);
            userOne._room = roomName;
            userTwo._room = roomName;
            userOne._socket.leave('lobby');
            userOne._socket.join(roomName);
            userTwo._socket.leave('lobby');
            userTwo._socket.join(roomName);
            room._room.emit('SearchStatus', {bool: false})
            await this.userService.setInGameBylogin(room._player._login, 2);
            await this.userService.setInGameBylogin(room._guest._login, 2);
            this.refreshFrontAll(room._player._login);
            this.refreshFrontAll(room._guest._login);
            room._player._socket.emit('startGame', {id: 1, room: roomName, nameA: room._player._login, nameB: room._guest._login, arcade:false})
            room._guest._socket.emit('startGame', {id: 2, room: roomName, nameA: room._player._login, nameB: room._guest._login, arcade:false});
            userOne._isInvitable = false;
            userTwo._isInvitable = false;
            room._isJoinable = false;
            this.index++;
            this.updateRoom();
        }
        else
            client.emit('pendingSearch');
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


    @SubscribeMessage('specRoom')
    specRoom(client: Socket, data: any ): void {
        var room = this.rooms.get(data.room)
        if(room)
        {
            client.leave('lobby');
            client.join(room._name);
            room.addSpec(this.clients.get(client.id));
            this.clients.get(client.id).setRoom(room._name);
            client.emit('startGame', {id: 3, room: room._name, nameA: room._player._login, nameB: room._guest._login});
            this.updateRoom();
        }
    }

    @SubscribeMessage('cancel')
    cancelSearch(client: Socket): void {
        var index = this.clientsSearching.indexOf(this.clients.get(client.id))
        console.log(this.clients.get(client.id)._login + 'leave waiting match')
        if (index > -1) {
            this.clientsSearching.splice(index, 1); // 2nd parameter means remove one item only
        }
        var index = this.clientsSearchingArcade.indexOf(this.clients.get(client.id))
        console.log(this.clients.get(client.id)._login + 'leave waiting match')
        if (index > -1) {
            this.clientsSearchingArcade.splice(index, 1); // 2nd parameter means remove one item only
        }
        client.emit('SearchStatus', {bool: false})
    }
    @SubscribeMessage('end')
    async abandon(client: Socket){
        var user = this.clients.get(client.id);
        var room = this.rooms.get(this.clients.get(client.id)._room)

        if (room)
        {
            if(room.isSpectate(this.clients.get(client.id))){
                client.emit('closeGame')
                return;
            }
		    room._room.emit('closeGame');
            var ret = room.abandon(user._login)
            console.log(room._guest._token + "   " + room._player._token)
            if (ret == 1){
                this.userService.win(room._guest._token);
                this.userService.xp(room._guest._token, 50);
                this.userService.loose(room._player._token);
                this.matchsService.create(room._guest._login, 5, room._player._login, room._scoreA, room._isArcade);
                await this.userService.setInGameBylogin(room._player._login, 1);
                await this.userService.setInGameBylogin(room._guest._login, 1);
                room._player._isInvitable = true;
                room._guest._isInvitable = true;
                this.refreshFrontAll(room._player._login);
                this.refreshFrontAll(room._guest._login);
            }
            if (ret == 2){
                this.userService.win(room._player._token);
                this.userService.xp(room._player._token, 50);
                this.userService.loose(room._guest._token);
                this.matchsService.create(room._player._login, 5, room._guest._login, room._scoreB, room._isArcade);
                await this.userService.setInGameBylogin(room._player._login, 1);
                await this.userService.setInGameBylogin(room._guest._login, 1);
                room._player._isInvitable = true;
                room._guest._isInvitable = true;
                this.refreshFrontAll(room._player._login);
                this.refreshFrontAll(room._guest._login);
        }
        this.rooms.delete(room._name);
        this.updateRoom();}
        // l'adversaire gagne le match
        // match history winner = 5 pts
        //
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
        var room = this.rooms.get(data.room)
        if(room)
            room.UpdatePos(data.id, data.y);
    }
    @SubscribeMessage('ball')
    ballUpdate(client: Socket, data: any): void {
        this.rooms.get(data.room).ballUpdate(data);
    }
    @SubscribeMessage('useSpell')
    useSpell(client: Socket, data: any): void {
        console.log(data)
        this.rooms.get(data.room)._room.emit('spellUsed', data)
    }

    @SubscribeMessage('score')
    Score(client: Socket, data: any): void {
                var room = this.rooms.get(data.room)
                var res = room.goal(data.goalID)
                if(res!= 0)
                {
                    if(res == 1)
                    {
                        room._player._socket.emit('popupScore', {win: true, adv:room._guest._login, arcade: room._isArcade, scoreLose: room._scoreB})
                        room._guest._socket.emit('popupScore', {win: false, adv:room._player._login, arcade: room._isArcade, scoreLose: room._scoreB})
                        this.userService.win(room._player._token);
                        this.userService.xp(room._player._token, 50);
                        this.userService.xp(room._guest._token, 10);
                        this.userService.loose(room._guest._token);
                        this.userService.setInGameBylogin(room._player._login, 1)
                        this.userService.setInGameBylogin(room._guest._login, 1)
                        room._player._isInvitable = true;
                        room._guest._isInvitable = true;
                        this.matchsService.create(room._player._login, 5, room._guest._login, room._scoreB, room._isArcade);
                    }
                    if(res == 2)
                    {
                        room._player._socket.emit('popupScore', {win: false, adv:room._player._login, arcade: room._isArcade, scoreLose: room._scoreA})
                        room._guest._socket.emit('popupScore', {win: true, adv:room._guest._login, arcade: room._isArcade, scoreLose: room._scoreA})
                        this.userService.win(room._guest._token);
                        this.userService.setInGameBylogin(room._player._login, 1)
                        this.userService.setInGameBylogin(room._guest._login, 1)
                        this.userService.xp(room._player._token, 10);
                        this.userService.xp(room._guest._token, 50);
                        this.userService.loose(room._player._token);
                        room._player._isInvitable = true;
                        room._guest._isInvitable = true;
                        this.matchsService.create(room._guest._login, 5, room._player._login, room._scoreA, room._isArcade);
                    }
                    room.clean();
                }
    }

    @SubscribeMessage("getRooms")
    updateRoom(){
        var spec : specRooms[] = [];

        this.rooms.forEach(element => {
            if (element._isJoinable === false)
                spec.push({name:element._name, left:element._player._login, right:element._guest._login, arcade:element._isArcade});
        });
        this.server.to('lobby').emit('SpecRooms', {spec: spec});
    }
    //GAME-PART

}

interface specRooms{
    name:string,
    left:string,
    right:string,
    arcade:boolean
}
