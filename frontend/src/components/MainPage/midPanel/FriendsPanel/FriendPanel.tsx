import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/FriendsPanel/FriendPanel.css'
import { user } from '../../MainPage'

export default class FriendPanel extends React.Component<{User:user},{select:number}>{
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
			<div className="list"></div>
			</div>
	  	</div>
    	)
	};
};
