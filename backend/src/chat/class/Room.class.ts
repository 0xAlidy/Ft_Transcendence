import axios from "axios";
import { BroadcastOperator } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { roomClass } from "src/game/class/room.class";

export class Room{
	id: number;
	name: string;
	password: string;
	userList: Array<string>;
	adminList: Array<string>;
	_room: BroadcastOperator<DefaultEventsMap>; // permet de faire room.emit("x", x)

	constructor(name:string, id:number, creator:string , password:string, room:BroadcastOperator<DefaultEventsMap>){
        	this.name = name;
       		this.id = id;
			this.password = password;
			this.userList =[creator];
			this._room = room;
    }

	Send(sender: string, dest: string, message: string, date: string){
		this._room.emit('ReceiveMessage', { sender: sender, dest: dest, message: message, date: message})
	}

}
