import { Socket } from "socket.io";

export class clientClass{
	_socket: Socket;
	_nbOfGames: number;
	_pseudo: string;
	_id: string;
	_room: string;
	constructor(socket: Socket){
		this._id = socket.id;
		this._socket = socket;
		this._room = '';
	}
	setName(name: string){
		this._pseudo = name;
	}
	setRoom(room : string){
		this._room = room;
	}
	leaveRoom(room : string){
		this._room = '';
	}
}
