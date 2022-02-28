import React from "react";
import { Socket } from "socket.io-client";
import '../../../../styles/MainPage/midPanel/MatchMaking/MatchMaking.css'
import { User } from "../../../../interfaces";
import ItemSpec from "./itemSpec";
interface specRoomsData{
	name:string,
	left:string,
	right:string,
	token:string
}
export default class MatchMaking extends React.Component<{socket:Socket, user:User},{Searching:boolean, rooms:specRoomsData[]}>{
	constructor(props :any) {
		super(props);
		this.state = {Searching:false, rooms:[{name:'roomtest', left:'edepauw', right:'tgrangeo', token:this.props.user.token}]}
		this.props.socket.on('SpecRooms', (data:any) => {
			data.spec.token = this.props.user.token
			this.setState({rooms: data.spec})
		})
		this.props.socket.on('SearchStatus', (data:any) => {
			this.setState({Searching: data.bool})
		})
	}
	onSpecClick = (room:string) =>
	{
		this.props.socket.emit('specRoom', {room: room});
	}
	render(){
		return ( <div className="midPanel">
				<h1>MATCHMAKING</h1>
				{!this.state.Searching ?<>
					<button className="buttonSearch" value='SEARCH'  onClick={() => {this.props.socket.emit('searchRoom'); this.setState({Searching:true})}}>SEARCH</button>:
					<button className="buttonSearch" value='SEARCH'  onClick={() => {this.props.socket.emit('searchArcade'); this.setState({Searching:true})}}>ARCADE</button></>:
					<button className="buttonSearch" value='CANCEL' onClick={() => {this.props.socket.emit('cancel'); this.setState({Searching:false})}}>CANCEL</button>
				}
				<h1>SPECTATE</h1>
				<div className='listSpec'>
				{
					this.state.rooms.map((item :specRoomsData, idx) => {
						return <ItemSpec data={item} onSpecCLick={this.onSpecClick} user={this.props.user} socket={this.props.socket} key={idx}/>;
					})
				}
				</div>
			</div>
    	)
	}
};
