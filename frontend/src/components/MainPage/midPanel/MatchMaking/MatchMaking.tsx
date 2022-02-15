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
		this.state = {Searching:false, rooms:[]}
		this.props.socket.on('SpecRooms', (data:any) => {
			data.spec.token = this.props.token
			this.setState({rooms: data.spec})
		})
	}
	onSpecClick = () =>
	{

	}
	render(){
		return (
        <div className="midPanel">
			{!this.state.Searching ?
				<button className="buttonSearch" value='SEARCH'  onClick={() => {this.props.socket.emit('searchRoom'); this.setState({Searching:true})}}>SEARCH</button>:
				<button className="buttonSearch" value='CANCEL' onClick={() => {this.props.socket.emit('cancel'); this.setState({Searching:false})}}>CANCEL</button>
			}
			{
				this.state.rooms.map((function(item :specRoomsData, idx) {
					return <ItemSpec data={item} token={item.token} key={idx}/>;
				}))
			}
		</div>
    	)
	}
};
