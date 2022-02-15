import { Socket } from "socket.io";

export class clientClass{
	_socket: Socket;
	_login: string;
	_token: string;
	_nbOfGames: number;
	_id: string;
	_room: string;
	_nickname:string;

	constructor(socket: Socket, login:string, token:string){
		this._id = socket.id;
		this._login = login;
		this._token = token;
		this._socket = socket;
		this._room = '';
	}
	setRoom(room : string){
		this._room = room;
	}

	leaveRoom(room : string){
		this._room = 'lobby';
	}
}
