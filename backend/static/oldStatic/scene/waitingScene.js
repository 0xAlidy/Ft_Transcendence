
class Waiting extends Phaser.Scene {
	next = 0;
	tick = 0;
	text;
	constructor(config) {
	  super("Waiting");
	}
    preload()
    {
        this.load.image('background', '../assets/background.png');
    }
    create()
    {
	    this.add.image(400, 300, 'background');
		this.text = this.add.text( 200 , 30 , 'Waiting', { fontSize: '80px', fill: '#ecf0f1', align: 'left' });
		var scene = this.scene;
		// socket.on('startGame', function (array) {
		// 	scene.start('Game');
		// });
	}
	update() {
		this.tick++;
		if(this.tick == 200)
			this.tick = 0;
		if(this.tick == 150)
		{
			this.text.setText('Waiting...');
			this.next = 0;
		}
		if(this.tick == 100)
		{
			this.text.setText('Waiting..');
			this.next = 0;
		}
		if(this.tick == 50)
		{
			this.text.setText('Waiting.');
			this.next = 2;
		}
		if(this.tick == 0)
		{
			this.text.setText('Waiting');
			this.next = 1;
		}
	}
}

