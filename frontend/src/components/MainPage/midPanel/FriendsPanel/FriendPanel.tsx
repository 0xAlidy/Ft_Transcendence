import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/FriendsPanel/FriendPanel.css'
import { User } from '../../../../interfaces'
import FriendItem from './FriendItem'
import BlockedItem from './BlockedItem'
import { Socket } from 'socket.io-client'

export default class FriendPanel extends React.Component<{User:User, socket:Socket},{select:number, status:number}>{
	constructor(props:any){
		super(props)
		this.state = {
			select: 0,
			status: 0,
		}
	}

	async componentDidMount(){
		const box = document.getElementById("list");
		const shadow = document.getElementById("shadow");
		const title = document.getElementById("friendPanelMenu");
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

	render(){
		return (
			<div className="midPanel">
				<div id="friendPanel">
					<div id='friendPanelMenu'>
						<div className="title friends active" onClick={this.OpenFriends}>Friends</div>
						<div className="title blocked" onClick={this.OpenBlocked}>Blocked</div>
					</div>
					<span id="shadow"></span>
					<div id="list">
						{this.state.select === 0 ?
							this.props.User.friends.map((login:string) => {
								return (<FriendItem key={'friends' + login} login={login} socket={this.props.socket} User={this.props.User}/>)		
							})
							:
							this.props.User.blockedUsers.map((login:string) => {
								return (<BlockedItem key={'blocked' + login} login={login} socket={this.props.socket} User={this.props.User}/>)		
							})
						}
					</div>
				</div>
			</div>
		)
	};
};
