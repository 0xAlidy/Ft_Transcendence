import Phaser from "phaser";
import * as React from "react";
// import { Login } from "./scene/loginScene";
import { Game } from "./scene/gameScene";
import { Socket } from "socket.io-client";

export interface IGameProps {}

export var USERNAME = '';

export default class IGame extends React.Component<{socket:Socket}, { game:Phaser.Game|null}> {
  ref: HTMLDivElement| null = null;
  constructor(props:any)
  {
    super(props);
    this.state = { game:null}
  }
  componentDidMount() {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        scale:{
            mode: Phaser.Scale.FIT,
            parent: 'phaser-game',
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            width: 800,
            height: 600,
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
        scene: []
    };
    var game = new Phaser.Game(config);
    this.setState({game:game})
    game.scene.add('Game', Game, true, this.props.socket)
  }
  setRef = (ref: HTMLDivElement) =>{
    this.ref = ref;
  }
  public openGame(){
    (document.getElementById('phaser-game') as HTMLDivElement).style.display = "inline";
      if(this.state.game)
        this.state.game.scene.keys['Game'].scene.wake();

  }
  public closeGame(){
    (document.getElementById('phaser-game') as HTMLDivElement).style.display = "none";
      if(this.state.game)
      this.state.game.scene.keys['Game'].scene.sleep();
  }
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (<>
            <div id="phaser-game" style={{display:"none"}}/>
          </>);
  }
}
