import React from "react";
import { Socket } from "socket.io-client";
import '../../../../styles/MainPage/midPanel/MatchMaking/MatchMaking.css'
import ItemSpec from "./itemSpec";
interface specRoomsData{
	name:string,
	left:string,
	right:string,
	token:string
}
export default class MatchMaking extends React.Component<{socket:Socket, token:string},{Searching:boolean, rooms:specRoomsData[]}>{
	constructor(props :any) {
		super(props);
		this.state = {Searching:false, rooms:[{name:'roomtest', left:'edepauw', right:'tgrangeo', token:this.props.token},{name:'roomtest', left:'edepauw', right:'tgrangeo', token:this.props.token},{name:'roomtest', left:'edepauw', right:'tgrangeo', token:this.props.token},{name:'roomtest', left:'edepauw', right:'tgrangeo', token:this.props.token},{name:'roomtest', left:'edepauw', right:'tgrangeo', token:this.props.token},{name:'roomtest', left:'edepauw', right:'tgrangeo', token:this.props.token}]}
		this.props.socket.on('SpecRooms', (data:any) => {
			data.spec.token = this.props.token
			this.setState({rooms: data.spec})
		})
	}
	onSpecClick = (room:string) =>
	{
		this.props.socket.emit('specRoom', {room: room});
	}
	render(){
		return (
        <div className="midPanel">
			<h1>MATCHMAKING</h1>
			{!this.state.Searching ?
				<button className="buttonSearch" value='SEARCH'  onClick={() => {this.props.socket.emit('searchRoom'); this.setState({Searching:true})}}>SEARCH</button>:
				<button className="buttonSearch" value='CANCEL' onClick={() => {this.props.socket.emit('cancel'); this.setState({Searching:false})}}>CANCEL</button>
			}
			<h1>SPECTATE</h1>
			<div className='listSpec'>
			{
				this.state.rooms.map((item :specRoomsData, idx) => {
					return <ItemSpec data={item} onSpecCLick={this.onSpecClick} token={item.token} key={idx}/>;
				})
			}
			</div>
		</div>
    	)
	}
};
