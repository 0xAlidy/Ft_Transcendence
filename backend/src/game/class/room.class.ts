import { Logger } from "@nestjs/common";
import { randomInt } from "crypto";
import { BroadcastOperator, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { clientClass } from "./client.class";

export class roomClass{
	_isArcade:boolean;
	_isJoinable = true;
	_speed = 10;
	_player: clientClass;
	_playerPos = 300;
	_readyPlayer = false;
	_room: BroadcastOperator<DefaultEventsMap>
	_guest: clientClass;
	_guestPos = 300;
	_readyGuest = false;
	_scoreA = 0;
	_scoreB = 0;
	_spectators: clientClass[] = [];
	_name: string;
	_numberOfPlayer: number;
	_numberOfSpec: number;
    private logger: Logger = new Logger('WS-game/Rooms');

	constructor(name: string, playerOne : clientClass, playerTwo: clientClass, room: BroadcastOperator<DefaultEventsMap>, arcade:boolean){
		this._name = name;
		if(randomInt(0,1))
		{
			this._player = playerOne;
			this._guest = playerTwo;
		}
		else{
			this._guest = playerOne;
			this._player = playerTwo;
		}
		this._isArcade = arcade;
		this._room = room;
		this.logger.log(name + ' created.');
	}
	clean()
	{
		this._room.emit('closeGame');
		this._player._socket.leave(this._name)
		this._player._socket.join('lobby')
		this._player._socket.leave(this._name)
		this._player._socket.join('lobby')
	}

	async sleep(ms:number){
		new Promise(r => setTimeout(r, ms));
	}

	async randomSpell(){
		// x random between 200 < x < 600
		// y random between 100 < y < 500
		// spell random : (speed up for adv)(hide for adv)
		if (this._isArcade)
		{
		var x = 400
		var y = this.randomIntFromInterval(100, 500)
		var spell = this.randomIntFromInterval(1, 10)
		if(spell <= 2){
			await this.sleep(this.randomIntFromInterval(1, 1000));
			this._room.emit('spawnSpell',{x:x, y:y, spell:spell})
		}
	}
	}
	randomIntFromInterval(min, max) { // min and max included
		return Math.floor(Math.random() * (max - min + 1) + min)
	  }

	abandon(client: string)
	{
		if(client === this._player._login)
		{
			this._player._socket.leave(this._name)
			this._player._socket.join('lobby')
			this._guest._socket.leave(this._name)
			this._guest._socket.join('lobby')
			this._player._socket.emit('popupScore', {win: false, adv:this._guest._login})
			this._guest._socket.emit('popupScore', {win: true, adv:this._player._login})
			return 1;
		}
		else if(client === this._guest._login){
			this._player._socket.leave(this._name)
			this._player._socket.join('lobby')
			this._guest._socket.leave(this._name)
			this._guest._socket.join('lobby')
			this._player._socket.emit('popupScore', {win: true, adv:this._guest._login})
			this._guest._socket.emit('popupScore', {win: false, adv:this._player._login})
			return 2;
		}
	}
	addGuest(client: clientClass){
		this._guest = client;
		this.logger.log(client._login + " join" + this._name + "as P2.");
	}
	isSpectate(client: clientClass){
		this._spectators.forEach(element => {
			if(element._login === client._login)
				return true;
		});
		return false
	}
	addSpec(client: clientClass){
		this._spectators.push(client);
		this.logger.log(client._login + " join " + this._name + "as spectator.");
	}
	removeSpec(client: clientClass){
		for( var i = 0; i < this._spectators.length; i++){

			if ( this._spectators[i]._id === client._socket.id) {

				this._spectators.splice(i, 1);
			}

		}
		this.logger.log(client._login + " leave " + this._name + "as spectator.");
	}
	removePlayer(client: clientClass): boolean{
		if(this._player._socket.id == client._socket.id)
			return true;
		return false;
	}
	throwBall(){
		var velY = Math.floor(Math.random() * 200) - 100;
		var velX =  -(Math.sqrt((250 * 250) - (Math.abs( velY ) * Math.abs( velY ))));
		velX = Math.floor(Math.random()) == 0 ? -velX : velX;
		var y = Math.floor(Math.random() * 600);
		this._room.emit('ballThrow', {velx: velX, vely: velY , y: y});
	}
	goal(id: number):number{
		if(id == 1)
			this._scoreA += 1;
		else
			this._scoreB += 1;
		console.log("scoreA:" + this._scoreA + "   scoreB:" + this._scoreB)
		if (this._scoreB == 5 ||this._scoreA == 5)
		{
			this._room.emit('ballThrow', {velx: 0, vely: 0 , y: -100});
			this._room.emit('winner', {id:id, winner: id == 1? this._player._login : this._guest._login});
			this._guest._nbOfGames +=1;
			this._player._nbOfGames +=1;
			this._room.emit('scoreUpdate', { a: this._scoreA.toString(), b: this._scoreB.toString()})
			return id == 1? 1: 2;
		}else{
			this.throwBall();
			this._room.emit('scoreUpdate', { a: this._scoreA.toString(), b: this._scoreB.toString()})
			return 0;
		}
	}
	playerMoved(moved: Socket){
		if(moved.id == this._player._socket.id)
			this._guest._socket.emit('moved' ,this._playerPos)
		else
			this._player._socket.emit('moved' ,this._playerPos)
	}
	setReady(id:number){
		if ( id == 1 )
		{
			this._readyPlayer = true;
			this._room.emit('readyPlayer', {id: 1});
		}
		if ( id == 2 )
		{
			this._readyGuest = true;
			this._room.emit('readyPlayer', {id: 2});
		}
		if(this._readyPlayer && this._readyGuest)
		{
			this._room.emit('go');
			this.throwBall();
		}
	}
	UpdatePos(id: number, y: number)
	{
		var socket = (id === 2 ? this._player._socket: this._guest._socket)
		socket.emit('updateBar'+ (id === 1 ? 'A':'B'), {y:y, id: id});
		this.specMessage('updateBar'+ (id === 1 ? 'A':'B'), {y:y, id: id})
	}
	specMessage(msg:string, data:any)
	{
		this._spectators.forEach(element => {
			element._socket.emit(msg, data);
		});
	}
	ballUpdate(data: any)
	{
		console.log(data)
		this._room.emit('updateBall', data);
		this.randomSpell();
	}
}
