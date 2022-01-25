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
import axios from 'axios';
import PopupStart from './PopupStart';
// import axios from 'axios';

export interface user{
	WSId: string;
	id: number;
	imgUrl: string;
	isActive: false;
	lvl: number;
	name: string;
	nickname: string;
	numberOfLoose: number;
	numberOfWin: number;
	secret: string;
	secretEnabled: false;
	token: string;
	xp: 0;
	firstConnection: boolean;
}

export default class MainPage extends React.Component<{token: string, name:string},{token:string, selector: string, socket: Socket|null, User:user|null, popupOpen:boolean, url:string|null}>{
	menuState: any
	selector : any;
	constructor(props :any) {
		super(props);
		this.state = {
			selector: 'game',
			url:null,
			socket: null,
			User: null,
			popupOpen: false,
			token: this.props.token
		};
	}

	async componentDidMount() {
		console.log("debug connection error" + this.state.token)
		if(this.props.token)
		{
			while (this.state.User === undefined || this.state.User === null ){
				await axios.get("HTTP://localhost:667/auth/me?token="+this.state.token).then(res => {
					this.setState({User: res.data, url: res.data.imgUrl})})
			}
			this.setState({socket: io('http://' + window.location.href.split('/')[2].split(':')[0] + ':667')})
			if (this.state.socket)
				this.state.socket.emit('setID', {token: this.props.token, name:this.props.name});
			else
				console.log("ERROR socket")
		}
	}

	refreshUser = async () => {
		await axios.get("HTTP://localhost:667/auth/me?token="+this.state.token).then(res => {
				this.setState({User: res.data, url: res.data.imgUrl})})
	}

	CompleteProfile = (User:user) => {
		this.setState({User: User});
	}
	render(){
		const Ref = (e: any) => {
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
			{this.state.User &&
			<>
				<div className="logo">
					<img src={LOGO} alt="" className="mainLogo"/>
				</div>
				<Menu onChange={Ref} imgsrc={this.state.User.imgUrl}/>
				{this.state.socket && <Chat socket={this.state.socket} username={this.state.User.name} />}
				<div className="game" id="game">
				{this.state.socket && this.state.selector === 'game' && <IGame socket={this.state.socket}/>}
				{this.state.selector === 'profile' && <Profile User={this.state.User} name={this.state.User.name} refreshUser={this.refreshUser}/>}
				{this.state.selector === 'achievement' && <Achievement />}
				{this.state.selector === 'history' && <History User={this.state.User}/>}
				{this.state.selector === 'admin' && <AdminPanel/>}
				</div>
				<PopupStart User={this.state.User} onChange={this.CompleteProfile}/>
			</>
			}
		</div>
    	)
	}
};
