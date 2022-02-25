import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/FriendsPanel/FriendPanel.css'
import { user } from '../../MainPage'
import ProfileShortCut from '../../ProfileShortcut'
import { Socket } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore 
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class FriendPanel extends React.Component<{User:user, socket:Socket},{select:number}>{
	constructor(props:any){
		super(props)
		this.state = {
			select:0
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
				<div className="friendPanel">
					<div className='friendPanelMenu'>
						<div className="title friends active" onClick={this.OpenFriends}>Friends</div>
						<div className="title blocked" onClick={this.OpenBlocked}>Blocked</div>
					</div>
					<span id="shadow"></span>
					<div className="list">
					
							{this.state.select === 0 ? 
								this.props.User.friends.map((value:string,index:number) => {
									return (
										<div key={'friends' + index} className="friendBox">
											<ProfileShortCut pseudo={value} socket={this.props.socket} user={this.props.User}/>
											<div style={{backgroundColor:(this.props.User.isActive ?'green':'grey'), borderRadius:'50%', width:'20px', height:'20px'}}/>
											<h3>{value}</h3>
											<FontAwesomeIcon className="chooseButton" icon={solid('message')}/>
											<FontAwesomeIcon className="chooseButton" icon={solid('table-list')}/>
											<FontAwesomeIcon className="chooseButton" icon={solid('hand-fist')}/>
											<FontAwesomeIcon className="chooseButton" icon={solid('hat-wizard')}/>
											<FontAwesomeIcon className="chooseButton" icon={solid('user-xmark')}/>
											<FontAwesomeIcon className="chooseButton" icon={solid('ban')}/>
										</div>
									);
								})
								:
								<p>SALUT</p>
							}
					</div>
				</div>
			</div>
		)
	};
};
