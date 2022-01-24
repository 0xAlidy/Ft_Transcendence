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

interface user{
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

export default class MainPage extends React.Component<{token: string, name:string},{token:string, selector: string, socket: Socket, User:user|null, popupOpen:boolean, url:string|null}>{
	menuState: any
	selector : any;
	constructor(props :any) {
		super(props);
		this.state = {
			selector: 'game',
			url:null,
			socket: io('http://' + window.location.href.split('/')[2].split(':')[0] + ':667'),
			User: null,
			popupOpen: false,
			token: this.props.token
		};
		this.state.socket.emit('setID', {token: this.props.token, name:this.props.name});
	}

	async componentDidMount() {
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
			{this.state.url &&
				<div className="divimg"><img src={this.state.User.imgUrl} className='menuprofileImg' alt="" />
				</div>
				}
				<div className="logo">
					<img src={LOGO} alt="" className="mainLogo"/>
				</div>
				<Menu onChange={Ref} imgsrc={this.state.User.imgUrl}/>
				<Chat socket={this.state.socket} username={this.state.User.name} />
				<div className="game" id="game">
				{this.state.selector === 'game' && <IGame socket={this.state.socket}/>}
				{this.state.selector === 'profile' && <Profile User={this.state.User} name={this.state.User.name}/>}
				{this.state.selector === 'achievement' && <Achievement />}
				{this.state.selector === 'history' && <History name={this.state.User.name}/>}
				{this.state.selector === 'admin' && <AdminPanel/>}
				</div>
				<PopupStart User={this.state.User} onChange={this.CompleteProfile}/>
			</>
			}
		</div>
    	)
	}
};
