import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/FriendPanel/FriendPanel.css'

export default class FriendPanel extends React.Component<{},{select:number}>{
	list:HTMLDivElement|null;
	constructor(props:any){
		super(props)
		this.list = null; 
		this.state = {select:0}
	}
	setRef(ref:HTMLDivElement){
		this.list = ref;
	}
	OpenBlocked(){

	}
	OpenWaiting(){

	}
	OpenFriends(){

	}
	render(){
		return (
		<div className="midPanel">
			<div className="blocked" onClick={this.OpenBlocked}></div>
			<div className="waiting" onClick={this.OpenWaiting}></div>
			<div className="friendList" onClick={this.OpenFriends}></div>
			<div className="listConstainer" ref={this.setRef}></div>
	  	</div>
    	)
	};
};
