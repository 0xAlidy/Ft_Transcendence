import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/History/History.css'
import ItemMatch from './itemMatch/itemMatch'
import axios from "axios";
import { user } from '../../MainPage';
import { Socket } from 'socket.io-client';


export default class History extends React.Component<{User:user, socket:Socket},{matchs:string[]}>{
	MatchList: any = [];
	constructor(props:any) {
		super(props)
		this.state={
				matchs:[],
			}
	};

	//loadMatchs =  () => {
	//	var self = this;
	//	this.state.matchs.map((function(item, idx) {
	//		return <ItemMatch match={item} token={self.props.User.token} name={item.split('/').at(4)} key={idx}/>;
	//	}))
	//};

	// createMatchElement = (newMatch:Match) => {
	// 	return (
	// 			<ItemMatch match={newMatch} name={this.props.name} key={newMatch.id}/>
	// 	)
	async componentDidMount() {
		var data = (await axios.get("http://" + window.location.host.split(":").at(0) + ":667/matchs?name="+ this.props.User.login +"&token="+ this.props.User.token)).data;
		this.setState({matchs: data});
		console.log(data);
	}

	render(){
		return (
        <div className="midPanel">
			<div id="history">
				<h1>History</h1>
				{
					this.state.matchs.map((item, idx) => {
						console.log(item , idx)
						return <ItemMatch match={item} token={this.props.User.token} socket={this.props.socket} user={this.props.User} name={this.props.User.login} key={idx}/>
					})
				}
			</div>
		</div>
    	)
	}
};
