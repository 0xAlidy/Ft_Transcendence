import Phaser from "phaser";
import { Scene } from "phaser";
import { Socket } from "socket.io-client";

export class Game extends Scene {
	Ready = false;
	nameA: any;
	nameC: any;
	nameB: any;
	uready = false;
	end = false;
	winnerText: any;
	textReadyA!: Phaser.GameObjects.Text; // ! care
	textReadyB!: Phaser.GameObjects.Text; // ! care
	match = {
		scoreA: 0,
		scoreB: 0
	};
	speed = 10;
	speedball = 250;
	multiplier = 1.2;
	x = 0;
	y = 0;
	ballX = 0;
	ballY = 0;
	barY = 0;
	barA: any;
	barB: any;
	ball: any;
	// cursor: any;
	bar: any;
	displayA: any;
	displayB: any;
	room: any;
	PLAYERID: any;
	Rectangle = Phaser.Geom.Rectangle;
	RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;
	GetRectangleIntersection = Phaser.Geom.Intersects.GetRectangleIntersection;
	rect1 = new Phaser.Geom.Rectangle();
	rect2 = new Phaser.Geom.Rectangle();
	rectball = new Phaser.Geom.Rectangle();
	textInfo: any;
	socket:Socket| null = null;

	inputUser:{down:Phaser.Input.Keyboard.Key|null, up:Phaser.Input.Keyboard.Key|null, esc:Phaser.Input.Keyboard.Key|null} = {down:null, up:null, esc:null};
	constructor() {
	  super("Game");
	  this.update = this.update.bind(this);
	}
	init(data: any)
    {
        this.socket = data;
        // this.PLAYERID = data.id;
		// this.room = data.room;
		// this.nameA = data.nameA;
		// this.nameB = data.nameB;
		// this.uready = false;
		// this.Ready = false;
        this.PLAYERID = 1;
		this.room = 'jean';
		this.nameA = 'testA';
		this.nameB = 'testB';
		this.uready = false;
		this.Ready = false;
	}

	preload ()
	{
		this.cameras.main.backgroundColor.setTo(31, 31, 31);
		this.load.image('bar', 'http://'+window.location.href.split('/')[2].split(':')[0]+':3000/assets/png/bar.png');
		this.load.image('background', 'http://'+window.location.href.split('/')[2].split(':')[0]+':3000/assets/png/background.png');
		this.load.image('ball', 'http://'+window.location.href.split('/')[2].split(':')[0]+':3000/assets/png/ball.png');
		this.load.audio('pop', 'http://'+window.location.href.split('/')[2].split(':')[0]+':3000/assets/sound/popPong.mp3')
	}
	LoadSocketEvents(socket:Socket){
		socket.on('startGame', (data:any) => {
			this.PLAYERID = data.id;
			this.room = data.room;
			this.nameA = data.nameA;
			this.nameB = data.nameB;
			this.uready = false;
			this.Ready = false;
			this.displayA.setText('0')
			this.displayB.setText('0')
			this.winnerText.setText('')
			this.textReadyA.setText('Waiting!')
			this.textReadyB.setText('Waiting!')
			this.textInfo.setText('press ↑ or ↓ for being ready!')
		});
		socket.on('readyPlayer', (data:any) => {
			if(data.id=== 1)
				this.textReadyA.setText('Ready!');
			if(data.id=== 2)
				this.textReadyB.setText('Ready!');
		});
		socket.on('go', () =>
		{
			if (this.PLAYERID !== 3)
			{
				this.textReadyA.setText('');
				this.textReadyB.setText('');
				this.textInfo.setText('');
				this.displayA.setFontSize('200px');
				this.displayB.setFontSize('200px');
				this.displayA.setPosition(200, 300);
				this.displayB.setPosition(600, 300);
				this.Ready = true;
			}
		});
		socket.on('ballThrow', (data:any) =>
		{
				this.ball.setPosition(400, data.y);
				this.x = data.velx;
				this.y = data.vely;
				this.speedball = 250;
				this.ball.setVelocity(data.velx, data.vely);
		});
		socket.on('updateBall', (data:any) =>
		{
				this.sound.play('pop');
				this.ball.setPosition(data.posx, data.posy);
				this.ball.setVelocity(data.velx, data.vely);
		});
		socket.on('updatePos', (data:any) =>
		{
			if (this.PLAYERID=== 3)
			{
				if (data.id=== 1)
					this.barA.setPosition(40, data.y);
				else
					this.barB.setPosition(760, data.y);
			}
			if(this.PLAYERID=== 1)
				this.barB.setPosition(760, data.y);
			else
				this.barA.setPosition(40, data.y);
		});
		socket.on('backToLobby',  () => {
			if (!this.end)
			{
				this.winnerText.setFontSize('30px');
				this.textReadyA.setText('');
				this.textReadyB.setText('');
				this.winnerText.setText('your opponent left..');
			}
		});
		socket.on('scoreUpdate', (score:any) => {
			this.displayA.setText(score.a);
			this.displayB.setText(score.b);
		});
		socket.on('winner',(data:any) => {
			this.end = true;
			this.textInfo.setText('Press ESC!');
			if (this.PLAYERID=== 3)
			{
				this.winnerText.setColor('#edca00');
				this.winnerText.setText(data.winner + ' WINS!');
			}
			if(this.PLAYERID=== data.id){
				this.winnerText.setColor('#edca00');
				this.winnerText.setText('YOU WIN!');
			}
			if(this.PLAYERID !== data.id && this.PLAYERID !== 3){
				this.winnerText.setColor('#d90024');
				this.winnerText.setText('YOU LOOSE!');
		}})
	}
	create ()
	{
		//variables init
		this.initKey();
		this.LoadImg();
		this.LoadTexts();
		this.uready = true;
		this.Ready = true;
		this.ball = this.physics.add.image(400, 300, 'ball').setBounce(1).setFriction(0);
		this.rectball = this.ball.getBounds();
		this.rect1 = this.barA.getBounds();
		this.rect2 = this.barB.getBounds();
		if (this.socket !== null)
			this.LoadSocketEvents(this.socket)

	}
	update ()
	{
		if(this.socket)
		{
			this.rectball = this.ball.getBounds();
			if (this.Ready === true && this.PLAYERID !== 3 )
			{
				if (this.PLAYERID ===  1)
				{
					this.checkCollision();
					this.checkGoal(this.socket);
					this.checkBounce();
				}
				this.Move(this.socket, (this.PLAYERID === 1) ? this.barA: this.barB );
			}
			else
			{
				this.waiting(this.socket)
			}
		}
	}

	//functions
	waiting(socket:Socket){
		if (!this.uready && this.PLAYERID !== 3)
		{
			if (this.inputUser.up && this.inputUser.down && (this.inputUser.up.isDown || this.inputUser.down.isDown))
			{
				socket.emit('ready', {id: this.PLAYERID, room: this.room});
				this.uready = true;
			}
		}
	}
	initKey(){
		this.inputUser.up = this.input.keyboard.addKey('UP');
		this.inputUser.down = this.input.keyboard.addKey('DOWN');
		this.inputUser.esc = this.input.keyboard.addKey('ESC');
		this.inputUser.esc.on('down', () => {
			if (this.socket !== null)
				this.socket.emit('end');
		});
	}
	disableEvent(){
		// this.inputUser.up;
		// this.inputUser.down ;
		// this.inputUser.esc;
	}
	LoadTexts(){
		this.add.text( 30 , 30 , this.nameA, {  fontSize: '40px', align: 'left' }).setColor('#636363');
		this.add.text( 770 , 70 , this.nameB, {  fontSize: '40px', align: 'left' }).setOrigin(1).setColor('#636363');
		this.displayA = this.add.text( 200 , -100 , '0', { fontSize: '80px'}).setOrigin(0.5).setColor('#636363');
		this.displayB = this.add.text( 600 , -100 , '0', {  fontSize: '80px'}).setOrigin(0.5).setColor('#636363');
		this.winnerText = this.add.text( 400 , 300 , '', {  fontSize: '80px', align: 'center' }).setOrigin(0.5).setColor('#ecf0f1');
		this.textReadyA = this.add.text( 200 , 300 , 'Waiting!', {  fontSize: '40px', align: 'left' }).setOrigin(0.5).setColor('#ecf0f1');
		this.textReadyB = this.add.text( 600 , 300 , 'Waiting!', {  fontSize: '40px', align: 'left' }).setOrigin(0.5).setColor('#ecf0f1');
		this.textInfo = this.add.text( 400 , 550 , 'press ↑ or ↓ for being ready!', {  fontSize: '30px', align: 'left' }).setOrigin(0.5).setColor('#ecf0f1');
	}
	LoadImg(){
		this.add.image(400, 300, 'background');
		this.barA = this.add.image(40, 300, 'bar');
		this.barB = this.add.image(760, 300, 'bar');
	}

	checkCollision(){
		this.rect1 = this.barA.getBounds();
		if (this.x < 0 && this.checkOverlap(this.rectball, this.rect1)){
			this.bounceSide(this.socket, this.barA, this.ball, false);
		}
		this.rect2 = this.barB.getBounds();
		if (this.x > 0 && this.checkOverlap(this.rectball, this.rect2)){
			this.bounceSide(this.socket, this.barB, this.ball, true);
		}
	}
	checkGoal(socket:Socket){
		if(this.ball.x <= 10 && this.x <= 0)
		{
			socket.emit('score', {
				goalID: 2,
				room: this.room
			});
		}
		if(this.ball.x >= 790 && this.x >= 0)
		{
			socket.emit('score', {
				goalID: 1,
				room: this.room
			});
		}
	}

	checkBounce()
	{
		if((this.ball.y <= 10 && this.y <= 0)||(this.ball.y >= 590 && this.y >= 0)){
		this.y *= -1;
		if (this.socket)
		this.socket.emit('ball', {
			room: this.room,
			velx: this.x,
			vely: this.y,
			posx: this.ball.x,
			posy: this.ball.y
		});
		}
	}
	Move(socket:Socket, bar:any){
		var mult = 0;
		var limite = 0;
		if(this.inputUser.up && this.inputUser.down)
		{
			if(this.inputUser.up.isDown && this.inputUser.down.isDown)
				mult = 0;
			else if(this.inputUser.down.isDown){
				mult = 1;
				limite = 560;
			}
			else if(this.inputUser.up.isDown){
				mult = -1;
				limite = 40;
			}
		}
		if(mult !== 0)
		{
			if (this.checkIfLimite(limite,(bar.y + this.speed)))
				bar.setPosition(bar.x, bar.y + (this.speed * mult));
			else
				bar.setPosition(bar.x, limite);
			socket.emit('playerMovement', {
						y: (this.PLAYERID === 1) ? this.barA.y : this.barB.y ,
						id: this.PLAYERID,
						room: this.room
			});
		}
	}
	checkIfLimite(limite:number, nextY:number){
		if(limite === 40){
			if(nextY > limite)
				return true
			else
				return false
		}
		if(limite === 560){
			if(nextY < limite)
				return true
			else
				return false
		}
		return false
	}
	checkOverlap(spriteA : Phaser.Geom.Rectangle, spriteB : Phaser.Geom.Rectangle) {
		return Phaser.Geom.Intersects.RectangleToRectangle(spriteB, spriteA);;
	}
	bounceSide(socket: any, bar: any, ball: any, bool: any)
	{
		var newx;
		var newy;
		if (bar.y - 38 < ball.y && ball.y > bar.y - 38 )
		{
			newy = 100 * ((bar.y - ball.y)/38) * 2;
			newx = Math.sqrt((this.speedball * this.speedball) - (Math.abs( newy ) * Math.abs( newy )));
			if (this.speedball < 1000)
				this.speedball *= this.multiplier;
			this.x = bool === false ? newx : -newx;
			this.y = -newy;
			if (isNaN(this.x))
				this.x = 150;
			socket.emit('ball', {
				room: this.room,
				velx: this.x,
				vely: this.y,
				posx: this.ball.x,
				posy: this.ball.y
			});
		}
		//update ve
	}
	backToLobby()
	{
	}
	getRandomInt(max: any) {
		return Math.floor(Math.random() * max);
	}
}
