import React from 'react'
import Chat from './Chat/Chat'
import '../../styles/MainPage/MainPage.css'
import '../../styles/MainPage/utility.css'
import { ReactComponent as Logo } from '../../assets/logo.svg';
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
import { User } from '../../interfaces'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DuelButton, DuelNotif, InviteButton, InviteNotif } from '../utility/utility';

interface popupScore{open:boolean, win:boolean, adv:string}

export default class MainPage extends React.Component<{ token: string, invite:boolean },{lastSelect:string, gameOpen:false, token:string, selector: string, socket: Socket|null, User:User|null, popupOpen:boolean, popupInfo:popupScore | null}>{

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
			await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/auth/me?token=" + this.state.token).then(res => {
				this.setState({ User: res.data })
			})
			window.onpopstate = (event:any) => {
				if(event){
					if (window.history.state.selector)
						this.setState({selector: window.history.state.selector})
					else
					{
						window.location.href = "HTTP://" + window.location.host.split(":").at(0) + ":3000";
					}
				}
			}
			if (this.state.User)
			{
					window.history.pushState({selector: this.state.selector}, '', "/");
					if (this.state.User.color)
						document.documentElement.style.setProperty('--main-color', this.state.User.color);
					this.setState({socket: io('http://' + window.location.href.split('/')[2].split(':')[0] + ':667',{query:{token:this.props.token}})})
					if (this.state.socket)
					{
						this.state.User.waitingFriends.forEach(element => {
							this.notify(element);
						});
						this.state.socket.on('startGame', () => {
							this.openGame();
						});
						this.state.socket.on('closeGame', () => {
							this.closeGame();
						});
						this.state.socket.on('popupScore', (data:any) => {
							this.setState({popupInfo:{open:true, win:data.win, adv:data.adv}})
						});
						this.state.socket.on('inviteNotif', (data:any) => {
							this.notify(data.login);
						});
						this.state.socket.on('inviteDuel', (data:any) => {
							this.notifyDuel(data.adv, data.room);
						});
						this.state.socket.on('refreshUser', async (data:any) => {
							console.log('refresh')
							await this.refreshUser()
						});
					}
					else
						console.log("ERROR socket")
			}
		}
	}

	notify = (login:string) => {
		if (this.state.socket && this.state.User)
		{
			var ret: JSX.Element = <InviteNotif user={this.state.User} socket={this.state.socket} login={login}/>
			var er: JSX.Element = <InviteButton login={login} socket={this.state.socket}/>
			toast(ret, { className: 'notif', bodyClassName: "bodyNotif", closeButton:er, onClose:this.refreshUser });
			// toast.dark(<DuelNotif token={this.props.token} login={login} socket={this.state.socket}/>); PAS TOUCHE JE VAIS OUBLIER SINON
		}
	}
	notifyDuel = (login:string, room:string) => {
		if(this.state.socket && this.state.User)
		{
			var ret: JSX.Element = <DuelNotif user={this.state.User} login={login} socket={this.state.socket}/>
			var er: JSX.Element = <DuelButton room={room} login={login} socket={this.state.socket}/>
			toast(ret, { className: 'notif', bodyClassName: "bodyNotif", closeButton:er, onClose:this.refreshUser });
			// toast.dark(<DuelNotif token={this.props.token} login={login} socket={this.state.socket}/>); PAS TOUCHE JE VAIS OUBLIER SINON
		}
	}

	refreshUser = async () => {
		await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/auth/me?token=" + this.state.token).then(res => {
			this.setState({ User: res.data })
		})
		if (this.state.socket)
			this.state.socket.emit("refreshUser")
	}

	CompleteProfile = (User:User) => {
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

	menuChange = async (e: any) => {		
		if (e.isAdminOpen){
			this.setState({selector: 'admin'}, () => {window.history.pushState({selector: this.state.selector}, '', "/")});
		}
		else if (e.isGameOpen){
			this.setState({selector: 'game'}, () => {window.history.pushState({selector: this.state.selector}, '', "/")});
		}
		else if (e.isHistoryOpen){
			this.setState({selector: 'history'}, () => {window.history.pushState({selector: this.state.selector}, '', "/")});
		}
		else if (e.isProfileOpen){
			this.setState({selector: 'profile'}, () => {window.history.pushState({selector: this.state.selector}, '', "/")});
		}
		else if (e.isFriendListOpen){
			this.setState({selector: 'friends'}, () => {window.history.pushState({selector: this.state.selector}, '', "/")});
		}
		else if (e.isRulesOpen){
			this.setState({selector: 'rules'}, () => {window.history.pushState({selector: this.state.selector}, '', "/")});
		}
	}

	render(){
		

		return (
		<>
			<ToastContainer
				className="notifContainer"
				position="top-left"
				autoClose={false}
				hideProgressBar={false}
				newestOnTop
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
			/>
			<div id="MainPage">
				{this.state.User && this.state.socket &&
				<>
					<div className="logo">
						<Logo className="mainLogo"/>
					</div>
					<Menu token={this.props.token} onChange={this.menuChange} imgsrc={this.state.User.imgUrl}/>
					<Chat socket={this.state.socket} User={this.state.User} />
					<div className="game" id="game">
						{this.state.selector === 'profile' && <Profile token={this.props.token} refreshUser={this.refreshUser}/>}
						{this.state.selector === 'history' && <History User={this.state.User} socket={this.state.socket}/>}
						{this.state.selector === 'admin' && <AdminPanel/>}
						{this.state.selector === 'game' && <MatchMaking user={this.state.User} socket={this.state.socket}/>}
						{this.state.selector === 'friends' && <FriendPanel User={this.state.User} socket={this.state.socket}/>}
						{this.state.selector === 'rules' && <p>RULES</p>}
						<IGame ref={this.ref} socket={this.state.socket}/>
					{/* <button onClick={this.notify}>oui</button> */}
					</div>
					{this.state.popupInfo && <Popup open={this.state.popupInfo.open} closeOnEscape={false}  onClose={() => this.setState({popupInfo:{open:false, win:true, adv:''}})} closeOnDocumentClick={true}>{this.state.popupInfo.win ? 'You win against ': 'You loose against'}{this.state.popupInfo.adv}<br/>{this.state.popupInfo.win && 'xp + 50'}</Popup>}
					{/*this.state.popupInvite && <Popup open={this.state.popupInvite.open} closeOnEscape={false}  onClose={() => this.setState({popupInfo:{open:false, win:true, adv:''}})} closeOnDocumentClick={true}>{this.state.popupInfo.win ? 'You win against ': 'You loose against'}{this.state.popupInfo.adv}<br/>{this.state.popupInfo.win && 'xp + 50'}</Popup>*/}
					<PopupStart User={this.state.User} onChange={this.CompleteProfile} invite={this.props.invite}/>
				</>
				}
			</div>
		</>
    	)
	}
};
