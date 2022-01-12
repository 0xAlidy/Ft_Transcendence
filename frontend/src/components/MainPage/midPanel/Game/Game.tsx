import Phaser from "phaser";
import * as React from "react";
// import { Login } from "./scene/loginScene";
import { Lobby } from "./scene/lobbyScene";
import { Game } from "./scene/gameScene";
import { Socket } from "socket.io-client";

export interface IGameProps {}

export var USERNAME = '';

export default class IGame extends React.Component<{socket:Socket}, any> {

  componentDidMount() {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        scale:{
            mode: Phaser.Scale.FIT,
            parent: 'phaser-game',
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            width: 800,
            height: 600,
            min:{
                width: 400,
                height: 300,
            },
            max:{
              width: 800,
              height: 600,
            }
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
        scene: [Lobby, Game]
    };
    var game = new Phaser.Game(config);
    game.scene.start('Lobby', {SOCKET: this.props.socket})

  }

  shouldComponentUpdate() {
    return false;
  }

  public render() {
    return <div id="phaser-game"/>;
  }
}
