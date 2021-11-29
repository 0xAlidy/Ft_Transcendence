import Phaser from "phaser";
import * as React from "react";
import { io } from "socket.io-client";
import { Login } from "./scene/loginScene";
import { Lobby } from "./scene/lobbyScene";
import { Game } from "./scene/gameScene";

export interface IGameProps {}

export var USERNAME = '';

export const socket = io('http://' + window.location.href.split('/')[2].split(':')[0] + ':667');

export default class IGame extends React.Component<IGameProps, any> {
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
        scene: [Login, Lobby, Game]
    };
    new Phaser.Game(config);
  }

  shouldComponentUpdate() {
    return false;
  }

  public render() {
    return <div id="phaser-game"/>;
  }
}
