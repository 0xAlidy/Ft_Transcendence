import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/FriendsPanel/FriendPanel.css'
import { User } from '../../../../interfaces'
import axios from 'axios';
import { Socket } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore 
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class BlockedItem extends React.Component<{login:string, User:User, socket:Socket},{UserBlocked:any}>{
    _isMounted = false;
	constructor(props:any){
		super(props)
		this.state = {
			UserBlocked:null
		}
	}

    async componentDidMount(){
        this._isMounted = true;
        await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.User.token +'&name='+ this.props.login)
		.then(res => this.setState({ UserBlocked: res.data }))
        this.props.socket.on('refreshUser', async (data:any) => {
			if (this.props.login === data.login)
			{
				await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.User.token +'&name='+ this.props.login)
				.then(res => {
                    if(this._isMounted)
                        this.setState({ UserBlocked: res.data })
                })
			}
		});
    }

    componentWillUnmount(){
		this._isMounted = false;
	}

    unban = () =>{
        this.props.socket.emit('unblockUser', { login:this.props.login })
    }

    render(){
        return (
            <>
            {
                this.state.UserBlocked &&
                <div className="blockedBox">
                    <img alt="UserImage" src={this.state.UserBlocked.imgUrl} className="blockedImg"/>
                    <h3>{this.state.UserBlocked.nickname}</h3>
                    <FontAwesomeIcon className="chooseButton" onClick={this.unban} icon={solid('xmark')}/>
                </div>
            }
            </>
        )
    }
}