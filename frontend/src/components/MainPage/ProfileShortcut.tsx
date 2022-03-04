import React from 'react'
import '../../../src/styles/MainPage/profileShortcut.css'
import axios from 'axios';
import Popup from 'reactjs-popup';
import Gauge from './midPanel/Profile/gauge';
import WinRate from './midPanel/Profile/winRate';
import { Socket } from 'socket.io-client';
import { UserPublic, User } from '../../interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class ProfileShortCut extends React.Component<{login: string, socket: Socket,  User: User}, {canOpen: boolean, opened: boolean, User: UserPublic | null, img: string | null}> {
	_isMounted = false;
	constructor(props:any) {
		super(props)
		this.state = {
			canOpen: this.props.login !== this.props.User.login,
			img: null,
			opened: false,
			User: null,
		}
	};

	async componentDidMount() {
		this._isMounted = true;
		await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.User.token +'&name='+ this.props.login)
		.then(res => {
			if(this._isMounted)
				this.setState({ User: res.data })
		})
		this.props.socket.on('refreshUser', async (data:any) => {
			if (this.props.login === data.login)
			{
				await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.User.token +'&name='+ this.props.login)
				.then(res => this.setState({ User: res.data }))
			}
		});
	}
	componentWillUnmount(){
		this._isMounted = false;
	}

	addFriend = () => {
		this.props.socket.emit('inviteFriend', { login:this.props.login })
	}

	joinPriv = () => {
		this.props.socket.emit('chatPrivate', {name:this.props.login, other:this.props.User.login })
		this.close();
	}

	removeFriend = () => {
		this.props.socket.emit('removeFriend', { login:this.props.login })
	}

	blockUser = () => {
		this.props.socket.emit('blockUser', { login:this.props.login })
		this.close();
	}

	inviteDuel = (arcade:boolean) =>{
        this.props.socket.emit('createPrivateSession', {login: this.props.login, arcade:arcade})
		this.close();
    }

	//this.props.socket.emit('createPrivateSession', {login: login, arcade:false})


	open = async () => {
		this.setState({ opened:true })
		if (this.state.canOpen)
		{
			let page = document.getElementById("MainPage");
			if (page)
				page.classList.add("blur");
		}
	}

	close = () => {
		this.setState({ opened:false });
		let page = document.getElementById("MainPage");
		if (page)
			page.classList.remove("blur");
	}

	setColorStatus = (status:number): string => {
		if (status === 0)
			return "var(--grey-color)";
		if (status === 1)
			return "var(--win-color)";
		return "var(--lose-color)";
	}

	handleHistory = () => {
		if (this.state.User)
			this.props.socket.emit('askHistoryOf', {login: this.state.User.login})
		this.close();
	}

	render(){
		return (
			<div className="profileShortcut">
				<Popup open={this.state.opened && this.state.canOpen} closeOnEscape={true} closeOnDocumentClick={true} onClose={this.close}>
				{
					this.state.User &&
					<div className="PopupContainer">
						<div id='profilSection'>
							<span>
								<img alt="UserImage" src={this.state.User.imgUrl} style={{borderRadius:"50%"}}/>
								{
									this.state.User.isFriend === 1 &&
									<div style={{backgroundColor:this.setColorStatus(this.state.User.status)}} className="status"/>
								}
							</span>
							<h2 className="popupName">{this.state.User.nickname}</h2>
						</div>
						<div id='levelSection'>
							<Gauge percent={this.state.User.xp.toString()} lvl={this.state.User.lvl.toString()}/>
							<WinRate win={this.state.User.numberOfWin} lose={this.state.User.numberOfLose}/>
						</div>
						<div id='buttonSection'>
							{
								this.state.User.isFriend < 3 &&
								<FontAwesomeIcon className="chooseButton" onClick={this.joinPriv} icon={solid('message')}/>
							}
							<FontAwesomeIcon className="chooseButton" onClick={this.handleHistory} icon={solid('table-list')}/>
							{
								this.state.User.isFriend === 1 && this.state.User.status === 1 &&
								<>
									<FontAwesomeIcon className="chooseButton" onClick={() => this.inviteDuel(false)} icon={solid('hand-fist')}/>
									<FontAwesomeIcon className="chooseButton"  onClick={() => this.inviteDuel(true)} icon={solid('hat-wizard')}/>
								</>
							}
							{
								this.state.User.isFriend === 0 &&
								<FontAwesomeIcon className="chooseButton" onClick={this.addFriend} icon={solid('user-plus')}/>
							}
							{
								this.state.User.isFriend === 1 &&
								<FontAwesomeIcon className="chooseButton" onClick={this.removeFriend} icon={solid('user-minus')}/>
							}
							{
								this.state.User.isFriend === 2 &&
								<FontAwesomeIcon className="chooseButton" icon={solid('user-clock')}/>
							}
							{
								this.state.User.isFriend !== 4 &&
								<FontAwesomeIcon className="chooseButton" onClick={this.blockUser} icon={solid('user-lock')}/>
							}
						</div>
					</div>
				}
				</Popup>
				{this.state.User && <img alt="UserProfile" src={this.state.User.imgUrl} style={{maxHeight:'100%'}} onClick={this.open}/>}
			</div>
    	)
	}
};
