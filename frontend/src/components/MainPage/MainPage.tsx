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
// import axios from 'axios';



export default class MainPage extends React.Component<{token: string, name:string},{selector: string, socket: Socket, username:string}>{
	menuState: any
	selector : any;
	constructor(props :any) {
		super(props);
		this.state = {
			selector: 'game',
			socket: io('http://' + window.location.href.split('/')[2].split(':')[0] + ':667'),
			username: 'null',
		};
		this.state.socket.emit('setID', {token: this.props.token, name:this.props.name});
	}

	async componentDidMount() {
		await axios.get("HTTP://localhost:667/auth/me?token="+this.props.token).then(res => this.setState({username: res.data.name}))
	}

	render(){
		// fetch("http://localhost:667/auth/me", {headers:{'Access-Control-Allow-Origin': '*'}}).then(res => {console.log('iccccciiiiiii   '+res)})
		// fetch("http://localhost:667/auth/me").then(res => console.log('iccccciiii'+ res));
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
			<div className="divimg">
				<img src={"https://cdn.intra.42.fr/users/small_"+ this.state.username +".jpg"} className='menuprofileImg' alt="" />
			</div>
			<div className="logo">
				<img src={LOGO} alt="" className="mainLogo"/>
			</div>
			<Menu onChange={Ref}/>
			<Chat socket={this.state.socket} username={this.state.username}/>
			<div className="game" id="game">
				{this.state.selector === 'game' && <IGame socket={this.state.socket}/>}
				{this.state.selector === 'profile' && <Profile token={this.props.token}/>}
				{this.state.selector === 'achievement' && <Achievement />}
				{this.state.selector === 'history' && <History name={this.state.username}/>}
				{this.state.selector === 'admin' && <AdminPanel/>}
			</div>
		</div>
    	)
	}
};
