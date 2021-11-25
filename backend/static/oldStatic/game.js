const config = {
    type: Phaser.AUTO,
    scale:{
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            gravity: { y: 0 }
        }
    },
    dom: {
        createContainer: true
    },
    scene: [Login, Lobby, Waiting, Game]
};

var game = new Phaser.Game(config);
