import React from 'react'
import Chat from './Chat/Chat'
import '../../styles/MainPage/MainPage.css'
import LOGO from '../../assets/logo.png'
import { io, Socket} from "socket.io-client";
import Menu from './Menu/Menu';
import IGame from './midPanel/Game/Game';
import Profile from './midPanel/Profile/Profile';
import Achievement from './midPanel/Achievement/Achievement';
import History from './midPanel/History/History';
import AdminPanel from './midPanel/AdminPanel/AdminPanel';


export default class MainPage extends React.Component<{token: string, name:string},{selector: string, socket: Socket}>{
	menuState: any
	selector : any;
	constructor(props :any) {
		super(props);
		this.state = {
			selector: 'game',
			socket: io('http://' + window.location.href.split('/')[2].split(':')[0] + ':667')
		};
		this.state.socket.emit('setID', {token: this.props.token, name:this.props.name});
	}

	render(){
		// var menu = this.menu.current;
		// var state = menu.getState();
		// console.log(menu.getState());
		const Ref = (e: any) => {
			console.log('update', e)
			document.getElementById('game');
			if (e.isAchievOpen){
				this.setState({selector: 'achievement'});
			}
			else if (e.isAdminOpen){
				this.setState({selector: 'admin'});
			}
			else if (e.isGameOpen){
				this.setState({selector: 'game'});
			}
			else if (e.isHistoryOpen){
				this.setState({selector: 'history'});
			}
			else if (e.isProfileOpen){
				this.setState({selector: 'profile'});
			}
		}
		return (
        <div id="MainPage">
			<div className="logo">
				<img src={LOGO} alt="" className="mainLogo"/>
			</div>
			<Menu onChange={Ref}/>
			<Chat socket={this.state.socket} />
			<div className="game" id="game">
				{this.state.selector === 'game' && <IGame socket={this.state.socket}/>}
				{this.state.selector === 'profile' && <Profile/>}
				{this.state.selector === 'achievement' && <Achievement />}
				{this.state.selector === 'history' && <History />}
				{this.state.selector === 'admin' && <AdminPanel/>}
			</div>
		</div>
    	)
	}
};
