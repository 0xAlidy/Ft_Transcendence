import { Scene } from "phaser";
import { socket } from "../Game";
export class Login extends Scene {
	username : any ;
	constructor() {
	  super("Login");
	}
	preload ()
	{
		this.cameras.main.backgroundColor.setTo(254,225,84);
		this.load.html('nameform', 'http://localhost:5000/loginForm.html');
		this.load.image('background', 'http://localhost:5000/background.png');
	}
	create ()
	{
		this.add.image(400, 300, 'background');
		var text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});
		var element = this.add.dom(400, 300).createFromCache('nameform');
		element.setPerspective(800);
		var scene = this.scene;
		element.addListener('click');
		element.on('click',  (event: any) => {
			if (event.target.name === 'loginButton')
			{
				var html = document.getElementById('username') as HTMLInputElement;
				var inputValue : string = html.value;
				//  Have they entered anything?
				if (inputValue !== '')
				{
					//  Turn off the click events
					element.removeListener('click');
					//  Tween the login form out
					element.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });

					element.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 3000, ease: 'Power3',
						onComplete: function ()
						{
							element.setVisible(false);
						}
					});
					// process.env.REACT_APP_USERNAME = inputValue;
					socket.emit('setPlayerName', inputValue);
					scene.start("Lobby");
				}
				else
				{
					element.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
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
