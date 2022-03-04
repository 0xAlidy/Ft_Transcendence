import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/FriendsPanel/FriendPanel.css'
import { User } from '../../../../interfaces'
import axios from 'axios';
import ProfileShortCut from '../../ProfileShortcut'
import { Socket } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore 
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class FriendItem extends React.Component<{login:string, User:User, socket:Socket},{UserFriend:any}>{
    _isMounted = false;
	constructor(props:any){
		super(props)
		this.state = {
			UserFriend:null
		}
	}

    async componentDidMount(){
        this._isMounted = true;
        await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.User.token +'&name='+ this.props.login)
		.then(res => this.setState({ UserFriend: res.data }))
        this.props.socket.on('refreshUser', async (data:any) => {
			if (this.props.login === data.login)
			{
				await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.User.token +'&name='+ this.props.login)
				.then(res => {
                    if (this._isMounted)
                        this.setState({ UserFriend: res.data })
                })
			}
		});
    }
    
    componentWillUnmount(){
		this._isMounted = false;
	}

    blockUser = () =>{
		this.props.socket.emit('blockUser', {login:this.state.UserFriend.login});
	}

    setColorStatus = (status:number): string => {
		if (status === 0)
			return "var(--grey-color)";
		if (status === 1)
			return "var(--win-color)";
		return "var(--lose-color)";
	}

    joinPriv = () => {
		this.props.socket.emit('chatPrivate', {name:this.props.login , other:this.props.User.login})
	}

    history = () =>{
		this.props.socket.emit('askHistoryOf', {login: this.props.login})
    }

    inviteDuel = (arcade:boolean) =>{
        this.props.socket.emit('createPrivateSession', {login: this.props.login, arcade:arcade})
    }

    removeFriend = () =>{
        this.props.socket.emit('removeFriend', { login:this.props.login })
    }

    ban = () =>{
        this.props.socket.emit('blockUser', { login:this.props.login })
    }

    render(){
        return (
            <>
            {
                this.state.UserFriend &&
                <div className="friendBox">
                    <ProfileShortCut login={this.props.login} socket={this.props.socket} User={this.props.User}/>
                    <div style={{backgroundColor:this.setColorStatus(this.state.UserFriend.status)}} className="statusFriendItem"/>
                    <h3>{this.state.UserFriend.nickname}</h3>
                    <FontAwesomeIcon className="chooseButton" onClick={this.joinPriv} icon={solid('message')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={this.history} icon={solid('table-list')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={() => this.inviteDuel(false)} icon={solid('hand-fist')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={() => this.inviteDuel(true)} icon={solid('hat-wizard')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={this.removeFriend} icon={solid('user-minus')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={this.ban} icon={solid('user-lock')}/>
                </div>
            }
            </>
        )
    }
}
