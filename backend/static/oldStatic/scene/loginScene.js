export class Login extends Phaser.Scene {
	constructor(config) {
	  super("Login");
	}
	preload ()
	{
		this.cameras.main.backgroundColor.setTo(254,225,84);
		this.load.html('nameform', '../html/loginForm.html');
		this.load.image('background', '../assets/background.png');
	}
	create ()
	{
		this.add.image(400, 300, 'background');
		var text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});
		var element = this.add.dom(400, 300).createFromCache('nameform');
		element.setPerspective(800);
		var scene = this.scene;
		element.addListener('click');
		element.on('click', function (event) {
			if (event.target.name === 'loginButton')
			{
				var inputUsername = this.getChildByName('username');

				//  Have they entered anything?
				if (inputUsername.value !== '')
				{
					//  Turn off the click events
					this.removeListener('click');
					//  Tween the login form out
					this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });

					this.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 3000, ease: 'Power3',
						onComplete: function ()
						{
							element.setVisible(false);
						}
					});
					socket.emit('setPlayerName', inputUsername.value);
					USERNAME = inputUsername.value;
					scene.start("Lobby");
				}
				else
				{
					this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
				}
			}
		});
		this.tweens.add({
			targets: element,
			y: 300,
			duration: 3000,
			ease: 'Power3'
		});
	}
}
