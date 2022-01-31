import { Socket } from "socket.io";

export class clientClass{
	_socket: Socket;
	_pseudo: string;
	_token: string;
	_id: string;
	_room: string;
	constructor(socket: Socket, token:string){
		this._id = socket.id;
		this._socket = socket;
		this._token = token;
		this._room = '';
	}
	setName(name: string){
		this._pseudo = name;
	}
	setToken(token: string){
		this._token = token;
	}
	setRoom(room : string){
		this._room = room;
	}
	leaveRoom(room : string){
		this._room = '';
	}
}
