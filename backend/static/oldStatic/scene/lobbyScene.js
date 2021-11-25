
class Lobby extends Phaser.Scene {
    list = [];
	constructor(config) {
	  super("Lobby");
	}
    preload()
    {
        this.load.html('hostform', '../html/hostForm.html');
        this.load.html('joinform', '../html/joinForm.html');
        this.load.html('joinItem', '../html/joinItem.html');
        this.load.html('specItem', '../html/specItem.html');
        this.load.image('background', '../assets/background.png');
    }
    create()
    {
        self = this;
	    this.add.image(400, 300, 'background');
	    socket.emit('waiting');
        this.add.text( 120 , 30 , 'HOST', { fontSize: '80px', fill: '#ecf0f1' });
        this.add.text( 480 , 30 , 'JOIN', {  fontSize: '80px', fill: '#ecf0f1' });
        var element = this.add.dom(180, 300).createFromCache('hostform');
        element.addListener('click');
        var scene = this.scene;
		element.on('click', function (event) {
			if (event.target.name === 'loginButton')
			{
				socket.emit('createRoom');
                // scene.start('Waiting');
            }
		});
        // var joinElement = this.add.dom(600, 287).createFromCache('joinform');
        // joinElement.addListener('click');
		// joinElement.on('click', function (event) {
		// 	if (event.target.name === 'joinButton'){
        //         var inputRoom = this.getChildByName('rooms').value;
        //         console.log(inputRoom);
		// 		socket.emit('joinRoom', inputRoom);
        //     }
		// });
        socket.on('updateRoom', function (data) {
            // joinElement.getChildByName('rooms') = '';
            var y = 80;
            var current;
            console.log('update');
            var opt = document.createElement("option");
            data.join.forEach(element => {
                if (element != USERNAME + "'s_room"){
                current = self.add.dom(600, 90 + y).createFromCache('joinItem');
                current.getChildByID('roomName').innerText = element;
                current.addListener('click');
                current.on('click', function(event){
                    console.log(event);
                    if (event.target.id === 'join')
                    {
                        socket.emit('joinRoom', element);
                    }
                });
                opt.value = element;
                opt.text = element;
                y += 40;
                // joinElement.getChildByName('rooms').add(opt);
                }
            });
            data.spec.forEach(element => {
                if (element != USERNAME + "'s_room"){
                current = self.add.dom(600, 90 + y).createFromCache('specItem');
                current.getChildByID('roomName').innerText = element;
                current.addListener('click');
                current.on('click', function(event){
                    console.log(event);
                    if (event.target.id === 'spec')
                    {
                        console.log("spec");
                        socket.emit('joinRoom', element);
                    }
                });
                opt.value = element;
                opt.text = element;
                y += 40;
                // joinElement.getChildByName('rooms').add(opt);
                }
            });
        });
        socket.on('startGame', function (data) {
            if (data.bool)
                scene.start('Game', data);
            else
                scene.restart('Game', data);
                console.log('start!');
        });
    }
}

