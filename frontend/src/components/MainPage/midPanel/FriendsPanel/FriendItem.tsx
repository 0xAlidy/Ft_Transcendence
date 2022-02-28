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
	constructor(props:any){
		super(props)
		this.state = {
			UserFriend:null
		}
	}

    async componentDidMount(){
        await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.User.token +'&name='+ this.props.login)
		.then(res => this.setState({ UserFriend: res.data }))
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

    mp = () =>{

    }
    history = () =>{

    }
    inviteDuel = (login:string) =>{
        this.props.socket.emit('createPrivateSession', {login: login, arcade:false})
    }
    inviteDuelArcade = (login:string) =>{
        this.props.socket.emit('createPrivateSession', {login: login, arcade:true})
    }
    removeFriend = () =>{

    }
    ban = () =>{

    }

    render(){
        return (
            <>
            {
                this.state.UserFriend &&
                <div className="friendBox">
                    <ProfileShortCut login={this.props.login} socket={this.props.socket} User={this.props.User}/>
                    <div style={{backgroundColor:this.setColorStatus(this.props.User.status)}} className="statusFriendItem"/>
                    <h3>{this.state.UserFriend.nickname}</h3>
                    <FontAwesomeIcon className="chooseButton" onClick={this.mp} icon={solid('message')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={this.history} icon={solid('table-list')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={() => this.inviteDuel(this.state.UserFriend.login)} icon={solid('hand-fist')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={() => this.inviteDuelArcade(this.state.UserFriend.login)} icon={solid('hat-wizard')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={this.removeFriend} icon={solid('user-xmark')}/>
                    <FontAwesomeIcon className="chooseButton" onClick={this.ban} icon={solid('ban')}/>
                </div>
            }
            </>
        )
    }
}
