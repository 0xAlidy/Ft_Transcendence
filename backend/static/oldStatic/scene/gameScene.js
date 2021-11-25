
class Game extends Phaser.Scene {
	Ready = false;
	uready = false;
	end = false;
	winnerText;
	textReadyA;
	textReadyB;
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
	barA;
	barB;
	ball;
	cursor;
	bar;
	displayA;
	displayB;
	room;
	PLAYERID;
	Rectangle = Phaser.Geom.Rectangle;
	RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;
	GetRectangleIntersection = Phaser.Geom.Intersects.GetRectangleIntersection;
	rect1 = new Phaser.Geom.Rectangle;
	rect2 = new Phaser.Geom.Rectangle;
	rectball = new Phaser.Geom.Rectangle;
	constructor(config) {
	  super("Game");
	  this.update = this.update.bind(this);
	}
	init(data)
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
		this.load.image('bar1', '../assets/bar.png');
		this.load.image('background', '../assets/background.png');
		this.load.image('ball1', '../assets/ball.png');
	}
2
	create ()
	{
		//variables init
		this.uready = false;
		this.Ready = false;
		this.cursor = this.input.keyboard.createCursorKeys();
		this.add.image(400, 300, 'background');
		this.displayA = this.add.text( 200 , -100 , '0', { fontSize: '80px', fill: '#636363' }).setOrigin(0.5);
		this.displayB = this.add.text( 600 , -100 , '0', {  fontSize: '80px', fill: '#636363' }).setOrigin(0.5);
		this.nameA = this.add.text( 30 , 30 , this.nameA, {  fontSize: '40px', fill: '#636363', align: 'left' });
		this.nameB = this.add.text( 770 , 70 , this.nameB, {  fontSize: '40px', fill: '#636363', align: 'left' }).setOrigin(1);
		this.winnerText = this.add.text( 400 , 300 , '', {  fontSize: '80px', fill: '#ecf0f1', align: 'center' }).setOrigin(0.5);
		this.barA = this.add.image(40, 300, 'bar1');
		this.barB = this.add.image(760, 300, 'bar1');
		this.ball = this.physics.add.image(400, this.getRandomInt(680) + 10 , 'ball1').setBounce(1).setFriction(0);
		this.rectball = this.ball.getBounds();
		this.rect1 = this.barA.getBounds();
		this.rect2 = this.barB.getBounds();
		if (this.PLAYERID != 3){
			this.textReadyA = this.add.text( 200 , 300 , 'Waiting!', {  fontSize: '40px', fill: '#ecf0f1', align: 'left' }).setOrigin(0.5);
			this.textReadyB = this.add.text( 600 , 300 , 'Waiting!', {  fontSize: '40px', fill: '#ecf0f1', align: 'left' }).setOrigin(0.5);
			this.textInfo = this.add.text( 400 , 550 , 'press ↑ or ↓ for being ready!', {  fontSize: '30px', fill: '#ecf0f1', align: 'left' }).setOrigin(0.5);
		}
		var self = this;
		//socket events
		var keyObj = this.input.keyboard.addKey('ESC');  // Get key object
		keyObj.on('down', function() {
			socket.emit('leaveRoom');
			self.backToLobby();
		});
		socket.on('readyPlayer', function(data){
			if(data.id == 1)
				self.textReadyA.setText('Ready!');
			if(data.id == 2)
				self.textReadyB.setText('Ready!');
		});
		socket.on('go', function()
		{
			if (self.PLAYERID != 3)
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
				console.log('posx:'+ data.posx + 'posy:'+ data.posy +'velx:'+ data.velx + 'vely:'+ data.vely );
				self.ball.setPosition(data.posx, data.posy);
				self.ball.setVelocity(data.velx, data.vely);
		});
		socket.on('updatePos', function(data)
		{
			if (self.PLAYERID == 3)
			{
				if (data.id == 1)
					self.barA.setPosition(40, data.y);
				else
					self.barB.setPosition(760, data.y);
			}
			if(self.PLAYERID == 1)
				self.barB.setPosition(760, data.y);
			else
				self.barA.setPosition(40, data.y);
		});
		socket.on('backToLobby', function () {
			if (!self.end)
			{
				self.winnerText.setFontSize('30px');
				self.winnerText.setText('your opponent left..');
			}
        });
		socket.on('scoreUpdate', function (score) {
			// console.log(score);
			self.displayA.setText(score.a);
			self.displayB.setText(score.b);
		});
		socket.on('winner', function (data) {
			// console.log(score);
			self.end = true;
			self.textInfo.setText('Press ESC!');
			if (self.PLAYERID == 3)
			{
				self.winnerText.setColor('#edca00');
				self.winnerText.setText(data.winner + ' WINS!');
			}
			if(self.PLAYERID == data.id){
				self.winnerText.setColor('#edca00');
				self.winnerText.setText('YOU WIN!');
			}
			if(self.PLAYERID != data.id && self.PLAYERID != 3){
				self.winnerText.setColor('#d90024');
				self.winnerText.setText('YOU LOOSE!');
		}});

	}

	update ()
	{
		this.rectball = this.ball.getBounds();
		if (this.Ready == true && this.PLAYERID != 3)
		{
			if (this.PLAYERID ==  1)
			{
				this.rect1 = this.barA.getBounds();
				if (this.x < 0 && this.checkOverlap(this.rectball, this.rect1)){
					console.log('marche');
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
				if (this.PLAYERID == 1)
				{
					if ((this.barA.y - this.speed) > 40)
						this.barA.setPosition(this.barA.x, this.barA.y - this.speed);
					else
						this.barA.setPosition(this.barA.x, 40);
				}
				if (this.PLAYERID == 2)
				{
					if ((this.barB.y - this.speed) > 40)
						this.barB.setPosition(this.barB.x, this.barB.y - this.speed);
					else
						this.barB.setPosition(this.barB.x, 40);
				}
				socket.emit('playerMovement', {
					y: (this.PLAYERID == 1) ? this.barA.y : this.barB.y ,
					id: this.PLAYERID,
					room: this.room
				});
			}
			if(this.cursor.down.isDown)
			{
				if (this.PLAYERID == 1)
				{
					if ((this.barA.y + this.speed) < 560)
						this.barA.setPosition(this.barA.x, this.barA.y + this.speed);
					else
						this.barA.setPosition(this.barA.x, 560);
				}
				if (this.PLAYERID == 2)
				{
					if ((this.barB.y + this.speed) < 560)
						this.barB.setPosition(this.barB.x, this.barB.y + this.speed);
					else
						this.barB.setPosition(this.barB.x, 560);
				}
					socket.emit('playerMovement', {
						y: (this.PLAYERID == 1) ? this.barA.y : this.barB.y ,
						id: this.PLAYERID,
						room: this.room
				});
			}
		}
		else
		{
			if (!this.uready && this.PLAYERID != 3)
			{
				if (this.cursor.up.isDown || this.cursor.down.isDown)
				{
					socket.emit('ready', {id: this.PLAYERID, room: this.room});
					this.uready = true;
				}
			}
		}
	}
	checkOverlap(spriteA, spriteB) {
		return Phaser.Geom.Intersects.RectangleToRectangle(spriteB, spriteA);;
	}
	bounceSide(socket, bar, ball, bool)
	{
		var newx;
		var newy;
		if (bar.y - 38 < ball.y && ball.y > bar.y - 38 )
		{
			newy = 100 * ((bar.y - ball.y)/38) * 2;
			newx = Math.sqrt((this.speedball * this.speedball) - (Math.abs( newy ) * Math.abs( newy )));
			console.log(this.speedball +'  '+ Math.abs( newy ));
			if (this.speedball < 1000)
				this.speedball *= this.multiplier;
			this.x = bool == 0 ? newx : -newx;
			this.y = -newy;
			if (this.x == NaN)
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
	getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
}
