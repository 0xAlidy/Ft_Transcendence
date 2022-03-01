import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/FriendsPanel/FriendPanel.css'
import { User } from '../../../../interfaces'
import FriendItem from './FriendItem'
import { Socket } from 'socket.io-client'

export default class FriendPanel extends React.Component<{User:User, socket:Socket},{select:number, status:number, User:any}>{
	constructor(props:any){
		super(props)
		this.state = {
			select: 0,
			status: 0,
			User:null
		}
	}

	async componentDidMount(){
		const box = document.getElementById("contentStart");
		const shadow = document.getElementById("shadow");
		const title = document.getElementById("title");
		if (box !== null && shadow !== null && title !== null)
			box.addEventListener("scroll", function() {
				if (this.scrollTop > 5)
				{
					shadow.style.boxShadow= "0px -11px 20px 13px var(--main-color)";
					title.style.boxShadow= "none";
				}
				else
					title.style.boxShadow= "0px 16px 13px 0px hsl(0deg 0% 7%)";
			});
	}
	componentDidUpdate(prevProps:{User:User, socket:Socket}, prevState:any) {
		if (prevProps.User.friends !== this.props.User.friends) {
			this.forceUpdate();
		}
	}

	OpenBlocked = () =>{
		this.setState({ select:1 });
		let blocked = document.querySelector(".blocked");
		let friends = document.querySelector(".friends");
        if (blocked && friends)
		{
            blocked.classList.add('active');
			friends.classList.remove('active');
		}
	}

	OpenFriends = () =>{
		this.setState({ select:0 });
		let blocked = document.querySelector(".blocked");
		let friends = document.querySelector(".friends");
        if (blocked && friends)
		{
            blocked.classList.remove('active');
			friends.classList.add('active');
		}
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
			<div className="midPanel">
				<div className="friendPanel">
					<div className='friendPanelMenu'>
						<div className="title friends active" onClick={this.OpenFriends}>Friends</div>
						<div className="title blocked" onClick={this.OpenBlocked}>Blocked</div>
					</div>
					<span id="shadow"></span>
					<div className="list">
						{this.state.select === 0 ?
							this.props.User.friends.map((login:string, index:number) => {
								return (<FriendItem key={'friends' + index} login={login} socket={this.props.socket} User={this.props.User}/>)		
							})
							:
							this.props.User.blockedUsers.map((login:string, index:number) => {
								//return (<blockedItem key={'friends' + index} login={login} socket={this.props.socket} User={this.props.User}/>)		
							})
						}
					</div>
				</div>
			</div>
		)
	};
};
