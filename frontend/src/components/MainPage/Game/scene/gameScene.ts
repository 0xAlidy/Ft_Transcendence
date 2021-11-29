import Phaser from "phaser";
import { Scene } from "phaser";
import { socket } from "../Game";

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
	cursor: any;
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
	constructor() {
	  super("Game");
	  this.update = this.update.bind(this);
	}
	init(data: any)
    {
        this.PLAYERID = data.id;
		this.room = data.room;
		this.nameA = data.nameA;
		this.nameB = data.nameB;
		this.uready = false;
		this.Ready = false;
        console.log('init', data);
    }

	preload ()
	{
		this.cameras.main.backgroundColor.setTo(31, 31, 31);
		this.load.image('bar1', 'http://'+window.location.href.split('/')[2].split(':')[0]+':667/bar.png');
		this.load.image('background', 'http://'+window.location.href.split('/')[2].split(':')[0]+':667/background.png');
		this.load.image('ball1', 'http://'+window.location.href.split('/')[2].split(':')[0]+':667/ball.png');
		this.load.audio('pop', 'http://'+window.location.href.split('/')[2].split(':')[0]+':667/popPong.mp3')
	}

	create ()
	{
		//variables init
		this.uready = false;
		this.Ready = false;
		this.cursor = this.input.keyboard.createCursorKeys();
		this.add.image(400, 300, 'background');
		this.displayA = this.add.text( 200 , -100 , '0', { fontSize: '80px'}).setOrigin(0.5).setColor('#636363');
		this.displayB = this.add.text( 600 , -100 , '0', {  fontSize: '80px'}).setOrigin(0.5).setColor('#636363');
		this.add.text( 30 , 30 , this.nameA, {  fontSize: '40px', align: 'left' }).setColor('#636363');
		this.add.text( 770 , 70 , this.nameB, {  fontSize: '40px', align: 'left' }).setOrigin(1).setColor('#636363');
		this.winnerText = this.add.text( 400 , 300 , '', {  fontSize: '80px', align: 'center' }).setOrigin(0.5).setColor('#ecf0f1');
		this.barA = this.add.image(40, 300, 'bar1');
		this.barB = this.add.image(760, 300, 'bar1');
		this.ball = this.physics.add.image(400, this.getRandomInt(680) + 10 , 'ball1').setBounce(1).setFriction(0);
		this.rectball = this.ball.getBounds();
		this.rect1 = this.barA.getBounds();
		this.rect2 = this.barB.getBounds();
		if (this.PLAYERID !== 3){
			this.textReadyA = this.add.text( 200 , 300 , 'Waiting!', {  fontSize: '40px', align: 'left' }).setOrigin(0.5).setColor('#ecf0f1');
			this.textReadyB = this.add.text( 600 , 300 , 'Waiting!', {  fontSize: '40px', align: 'left' }).setOrigin(0.5).setColor('#ecf0f1');
			this.textInfo = this.add.text( 400 , 550 , 'press ↑ or ↓ for being ready!', {  fontSize: '30px', align: 'left' }).setOrigin(0.5).setColor('#ecf0f1');
		}
		var self = this;
		//socket events
		var keyObj = this.input.keyboard.addKey('ESC');  // Get key object
		keyObj.on('down', function() {
			socket.emit('leaveRoom');
			self.backToLobby();
		});
		socket.on('readyPlayer', function(data){
			if(data.id=== 1)
				self.textReadyA.setText('Ready!');
			if(data.id=== 2)
				self.textReadyB.setText('Ready!');
		});
		socket.on('go', function()
		{
			if (self.PLAYERID !== 3)
			{
				self.textReadyA.setText('');
				self.textReadyB.setText('');
				self.textInfo.setText('');
				self.displayA.setFontSize('200px');
				self.displayB.setFontSize('200px');
				self.displayA.setPosition(200, 300);
				self.displayB.setPosition(600, 300);
				self.Ready = true;
			}
		});
		socket.on('ballThrow', function(data)
		{
				self.ball.setPosition(400, data.y);
				self.x = data.velx;
				self.y = data.vely;
				self.speedball = 250;
				self.ball.setVelocity(data.velx, data.vely);
		});
		socket.on('updateBall', function(data)
		{
				self.sound.play('pop');
				self.ball.setPosition(data.posx, data.posy);
				self.ball.setVelocity(data.velx, data.vely);
		});
		socket.on('updatePos', function(data)
		{
			if (self.PLAYERID=== 3)
			{
				if (data.id=== 1)
					self.barA.setPosition(40, data.y);
				else
					self.barB.setPosition(760, data.y);
			}
			if(self.PLAYERID=== 1)
				self.barB.setPosition(760, data.y);
			else
				self.barA.setPosition(40, data.y);
		});
		socket.on('backToLobby', function () {
			if (!self.end)
			{
				self.winnerText.setFontSize('30px');
				self.textReadyA.setText('');
				self.textReadyB.setText('');
				self.winnerText.setText('your opponent left..');
			}
        });
		socket.on('scoreUpdate', function (score) {
			self.displayA.setText(score.a);
			self.displayB.setText(score.b);
		});
		socket.on('winner', function (data) {
			self.end = true;
			self.textInfo.setText('Press ESC!');
			if (self.PLAYERID=== 3)
			{
				self.winnerText.setColor('#edca00');
				self.winnerText.setText(data.winner + ' WINS!');
			}
			if(self.PLAYERID=== data.id){
				self.winnerText.setColor('#edca00');
				self.winnerText.setText('YOU WIN!');
			}
			if(self.PLAYERID !== data.id && self.PLAYERID !== 3){
				self.winnerText.setColor('#d90024');
				self.winnerText.setText('YOU LOOSE!');
		}});

	}

	update ()
	{
		console.log('update');
		this.rectball = this.ball.getBounds();
		if (this.Ready=== true && this.PLAYERID !== 3)
		{
			if (this.PLAYERID===  1)
			{
				this.rect1 = this.barA.getBounds();
				if (this.x < 0 && this.checkOverlap(this.rectball, this.rect1)){
					this.bounceSide(socket, this.barA, this.ball, false);
				}
				this.rect2 = this.barB.getBounds();
				if (this.x > 0 && this.checkOverlap(this.rectball, this.rect2)){
					this.bounceSide(socket, this.barB, this.ball, true);
				}
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
				if(this.ball.y <= 10 && this.y <= 0)
					this.bounceTopBot();
				else if(this.ball.y >= 590 && this.y >= 0)
					this.bounceTopBot();
			}
			if(this.cursor.up.isDown)
			{
				if (this.PLAYERID=== 1)
				{
					if ((this.barA.y - this.speed) > 40)
						this.barA.setPosition(this.barA.x, this.barA.y - this.speed);
					else
						this.barA.setPosition(this.barA.x, 40);
				}
				if (this.PLAYERID=== 2)
				{
					if ((this.barB.y - this.speed) > 40)
						this.barB.setPosition(this.barB.x, this.barB.y - this.speed);
					else
						this.barB.setPosition(this.barB.x, 40);
				}
				socket.emit('playerMovement', {
					y: (this.PLAYERID=== 1) ? this.barA.y : this.barB.y ,
					id: this.PLAYERID,
					room: this.room
				});
			}
			if(this.cursor.down.isDown)
			{
				if (this.PLAYERID=== 1)
				{
					if ((this.barA.y + this.speed) < 560)
						this.barA.setPosition(this.barA.x, this.barA.y + this.speed);
					else
						this.barA.setPosition(this.barA.x, 560);
				}
				if (this.PLAYERID=== 2)
				{
					if ((this.barB.y + this.speed) < 560)
						this.barB.setPosition(this.barB.x, this.barB.y + this.speed);
					else
						this.barB.setPosition(this.barB.x, 560);
				}
					socket.emit('playerMovement', {
						y: (this.PLAYERID=== 1) ? this.barA.y : this.barB.y ,
						id: this.PLAYERID,
						room: this.room
				});
			}
		}
		else
		{
			if (!this.uready && this.PLAYERID !== 3)
			{
				if (this.cursor.up.isDown || this.cursor.down.isDown)
				{
					socket.emit('ready', {id: this.PLAYERID, room: this.room});
					this.uready = true;
				}
			}
		}
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
		this.scene.start('Lobby');
	}
	bounceTopBot()
	{
		this.y *= -1;
		socket.emit('ball', {
			room: this.room,
			velx: this.x,
			vely: this.y,
			posx: this.ball.x,
			posy: this.ball.y
		});
	}
	getRandomInt(max: any) {
		return Math.floor(Math.random() * max);
	}
}
