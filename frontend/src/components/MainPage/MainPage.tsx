import React from 'react'
import Chat from './Chat/Chat'
import '../../styles/MainPage/MainPage.css'
import LOGO from '../../assets/logo.png'
import { io, Socket} from "socket.io-client";
import Menu from './Menu/Menu';
import IGame from './midPanel/Game/Game';
import Profile from './midPanel/Profile/Profile';
import History from './midPanel/History/History';
import AdminPanel from './midPanel/AdminPanel/AdminPanel';
import axios from 'axios';
import PopupStart from './PopupStart';
import FriendPanel from './midPanel/FriendsPanel/FriendPanel';
import MatchMaking from './midPanel/MatchMaking/MatchMaking';
import Popup from 'reactjs-popup';

export interface user{
	WSId: string;
	id: number;
	imgUrl: string;
	isActive: false;
	lvl: number;
	login: string;
	nickname: string;
	numberOfLoose: number;
	numberOfWin: number;
	secret: string;
	secretEnabled: false;
	token: string;
	xp: 0;
	firstConnection: boolean;
}
interface popupScore{open:boolean, win:boolean, adv:string}

export default class MainPage extends React.Component<{ token: string },{lastSelect:string, gameOpen:false, token:string, selector: string, socket: Socket|null, User:user|null, popupOpen:boolean, url:string|null, popupInfo:popupScore | null}>{
	menuState: any
	selector : any;
	ref:any;

	constructor(props :any) {
		super(props);
		this.state = {
			popupInfo:null,
			lastSelect:'game',
			gameOpen:false,
			selector: 'game',
			url:null,
			socket: null,
			User: null,
			popupOpen: false,
			token: this.props.token
		};
		this.ref = React.createRef();
	}

	async componentDidMount() {
		
		if (this.state.token)
		{
			console.log("debug connection error" + this.state.token)
			await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/auth/me?token=" + this.state.token).then(res => {
				this.setState({User: res.data, url: res.data.imgUrl})
			})
			if (this.state.User)
				this.setState({socket: io('http://' + window.location.href.split('/')[2].split(':')[0] + ':667',{query:{token:this.props.token, name:this.state.User.login}})}) // NICKNAME ?
			if (this.state.socket){
				this.state.socket.on('startGame', () => {
					this.openGame();
				});
				this.state.socket.on('closeGame', () => {
					this.closeGame();
				});
				this.state.socket.on('popupScore', (data:any) => {
					this.setState({popupInfo:{open:true, win:data.win, adv:data.adv}})
				});
				this.state.socket.on('invite', (data:any) => {
					//data.adv:string, data.room:'data.clientName/data.inviteName'
				});
				if (this.state.User && this.state.User.nickname) // checkpremierconnexion où le nickname n'est pas set
					this.state.socket.emit('setID', { token: this.props.token });
			}
			else
				console.log("ERROR socket")
		}
	}

	refreshUser = async () => {
		await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/auth/me?token=" + this.state.token).then(res => {
			this.setState({User: res.data, url: res.data.imgUrl})
		})
	}

	CompleteProfile = (User:user) => {
		this.setState({ User: User });
	}

	openGame(){
		this.ref.current.openGame();
		this.setState({lastSelect: this.state.selector})
		this.setState({selector:'none'})
	}

	closeGame(){
		this.ref.current.closeGame();
		this.setState({selector:this.state.lastSelect})
	}

	closePopup(){

	}

	render(){
		const Ref = (e: any) => {
			if (e.isAdminOpen){
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
			else if (e.isFriendListOpen){
				this.setState({selector: 'friends'});
			}
		}

		return (
			<div id="MainPage">
				{this.state.User && this.state.socket &&
				<>
					<div className="logo">
						<img src={LOGO} alt="" className="mainLogo"/>
					</div>
					<Menu onChange={Ref} imgsrc={this.state.User.imgUrl}/>
					<Chat socket={this.state.socket} User={this.state.User} />
					<div className="game" id="game">
						{this.state.selector === 'profile' && <Profile User={this.state.User} refreshUser={this.refreshUser}/>}
						{this.state.selector === 'history' && <History User={this.state.User}/>}
						{this.state.selector === 'admin' && <AdminPanel/>}
						{this.state.selector === 'game' && <MatchMaking token={this.state.User.token} socket={this.state.socket}/>}
						{this.state.selector === 'friends' && <FriendPanel/>}
						<IGame ref={this.ref} socket={this.state.socket}/>
					</div>
					{this.state.popupInfo && <Popup open={this.state.popupInfo.open} closeOnEscape={false}  onClose={() => this.setState({popupInfo:{open:false, win:true, adv:''}})} closeOnDocumentClick={true}>{this.state.popupInfo.win ? 'You win against ': 'You loose against'}{this.state.popupInfo.adv}<br/>{this.state.popupInfo.win && 'xp + 50'}</Popup>}
					{/*this.state.popupInvite && <Popup open={this.state.popupInvite.open} closeOnEscape={false}  onClose={() => this.setState({popupInfo:{open:false, win:true, adv:''}})} closeOnDocumentClick={true}>{this.state.popupInfo.win ? 'You win against ': 'You loose against'}{this.state.popupInfo.adv}<br/>{this.state.popupInfo.win && 'xp + 50'}</Popup>*/}
					<PopupStart User={this.state.User} onChange={this.CompleteProfile}/>
				</>
				}
			</div>
    	)
	}
};
