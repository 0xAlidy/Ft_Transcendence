import React from 'react'
import '../../../src/styles/MainPage/profileShortcut.css'
import axios from 'axios';
import Popup from 'reactjs-popup';
import { Socket } from 'socket.io-client';
import { user } from './MainPage';
// import { Socket } from 'socket.io-client';

interface userPublic{
	imgUrl: string;
	isActive: boolean;
	waiting:boolean;
	lvl: number;
	name: string;
	nickname: string;
	numberOfLoose: number;
	friends:string [];
	numberOfWin: number;
	xp: number;
}
export default class ProfileShortCut extends React.Component<{pseudo:string, socket:Socket,  user:user},{canOpen: boolean,isFriend:number | null, opened:boolean, User:userPublic|null, online:boolean|null, img:string|null}>{
	MatchList: any = [];
	constructor(props:any) {
		super(props)
		this.state={
				canOpen: this.props.pseudo !== this.props.user.login,
				img: null,
				opened:false,
				User:null,
				online:null, // 0 offline // 1 online // 2 ingame
				isFriend:null, // 0 not friend // 1 waiting // 2 friend
			}
			// this.props.socket.on('updateProfile'+ this.props.pseudo,(data:any) =>{

			// })
	};
	async componentDidMount() {
		await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUserImage?token="+ this.props.user.token +'&name='+ this.props.pseudo)
		.then(res => this.setState({img: res.data.imgUrl}))
	}

	addFriend = () =>{
		this.props.socket.emit('inviteFriend', {login:this.props.pseudo})
		this.setState({isFriend:1})
	}
	removeFriend = () =>{
		this.props.socket.emit('removeFriend', {login:this.props.pseudo})
		this.setState({isFriend:0})
	}
	open = async () =>{
		console.log('open')
		await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.user.token +'&name='+ this.props.pseudo)
		.then(res => this.setState({User: res.data}))
		if(this.state.User)
		{
			if (this.state.User.waiting)
				this.setState({isFriend: 1, online:this.state.User.isActive, opened:true})
			else
				this.setState({isFriend: (this.state.User.friends.indexOf(this.props.user.login) !== -1? 2 : 0), online:this.state.User.isActive, opened:true})
		}
		this.setState({opened:true})
	}

	render(){
		return (
			<>
					<div className="profileShortcut">
						<Popup open={this.state.opened && this.state.canOpen} closeOnEscape={true} closeOnDocumentClick={true} onClose={() =>{this.setState({opened:false, User:null})}}>
							{this.state.User && <div className="PopupContainer">
								<div id='profilSection'>
									<span>
										<img alt="UserImage" src={this.state.User.imgUrl} style={{borderRadius:"50%"}}/>
										<div style={{backgroundColor:(this.state.online ?'green':'grey'), borderRadius:'50%', width:'20px', height:'20px'}}/>
									</span>
									<div className="popupName">{this.state.User.nickname}</div>
								</div>
								<div id='levelSection'>
									<div className="lvl">LEVEL<br/>{this.state.User.lvl}</div>
									<div className="ratio">W/L<br/>{this.state.User.numberOfWin+'/'+this.state.User.numberOfLoose}</div>
								</div>
								<div id='buttonSection'>
									<div className="mp">
										<button className='ProfileShortcutButton'>MP</button>
									</div>
									<div className="addFriend">
										{this.state.isFriend === 0 &&
										<button className='ProfileShortcutButton' onClick={this.addFriend}>addFriend</button>
										}
										{this.state.isFriend === 1 &&
										<button className='ProfileShortcutButton' >waiting</button>
										}
										{this.state.isFriend === 2 &&
										<button className='ProfileShortcutButton' onClick={this.removeFriend}>{"removeFriend"}</button>
										}
									</div>
									<div className="duel">
										<button className='ProfileShortcutButton'>DUEL</button></div>
									<div className="history">
										<button className='ProfileShortcutButton'>HISTORY</button></div>
								</div>
							</div>}
						</Popup>
						{this.state.img && <img alt="UserProfile" src={this.state.img} style={{maxHeight:'100%'}} onClick={this.open}/>}
					</div>
			</>
    	)
	}
};
