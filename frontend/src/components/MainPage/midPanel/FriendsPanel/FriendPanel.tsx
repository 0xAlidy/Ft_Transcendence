import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/FriendsPanel/FriendPanel.css'
import { user } from '../../MainPage'
import ProfileShortCut from '../../ProfileShortcut'
import { Socket } from 'socket.io-client'

export default class FriendPanel extends React.Component<{User:user, socket:Socket},{select:number}>{
	constructor(props:any){
		super(props)
		this.state = {select:0}
	}
	async componentDidMount(){
	}
	OpenBlocked = () =>{
		this.setState({select:2});
	}
	OpenInvite = () =>{
		this.setState({select:1});
	}
	OpenFriends = () =>{
		this.setState({select:0});
	}
	render(){
		return (
		<div className="midPanel">
			<div className="friendPanel">
				<div className="friends" onClick={this.OpenFriends} style={this.state.select === 0 ?{color:'#fee154', borderColor:'#fee154'}:{color:'#fee154', borderColor:'#00000000'}}>Friends</div>
				<div className="blocked" onClick={this.OpenBlocked} style={this.state.select === 2 ?{color:'#fee154', borderColor:'#fee154'}:{color:'#fee154', borderColor:'#00000000'}}>Blockeds</div>
				<div className="list">
						{this.props.User.friends.map((value:string,index:number) => {
							return (<div key={'friends'+index} style={{backgroundColor:'#3f3f3f', display:"flex", marginTop:'10px'}}>
									<ProfileShortCut pseudo={value} socket={this.props.socket} user={this.props.User}/>
									{value}
									<button>mp</button>
									<button>duel</button>
									<button>duel arcade</button>
									<button></button>
									</div>);
							})
						}
				</div>
			</div>
	  	</div>
		)
	};
};
