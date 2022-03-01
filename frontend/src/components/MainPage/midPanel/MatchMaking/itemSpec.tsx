import axios from "axios";
import * as React from "react";
import { Socket } from "socket.io-client";
import { User } from "../../../../interfaces";
import ProfileShortCut from "../../ProfileShortcut";

interface specRoomsData{
	name:string,
	left:string,
	right:string,
}
export default class ItemSpec extends React.Component<{data:specRoomsData, user:User, onSpecCLick:any, socket:Socket},{left:string|null, right:string|null}>{
	constructor(props:any)
	{
		super(props);
		this.state = {
			left: null,
			right: null
		}
	}

	async componentDidMount(){
		await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/user/getNickname?login=" + this.props.data.right).then(res => {
			this.setState({right: res.data})
		})
		await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/user/getNickname?login=" + this.props.data.left).then(res => {
			this.setState({left: res.data})
		})
	}

	specClick = () =>{
		this.props.onSpecCLick(this.props.data.name);
	}

	render(){
		return (
			<div className="itemSpec">
				{	this.state.left && this.state.right &&
					<div className="grid">
						<div className="imgLeft">
							<ProfileShortCut  login={this.props.data.left} User={this.props.user} socket={this.props.socket}/>
						</div>
						<div className="imgRight">
							<ProfileShortCut  login={this.props.data.right} User={this.props.user} socket={this.props.socket} />
						</div>
						<div className="text">VS</div>
						<div className="nameLeft">
							{this.state.left}
						</div>
						<div className="nameRight">
							{this.state.right}
						</div>
						<div className="specButtongrid">
							<button className="specButton" onClick={this.specClick}>Spectate</button>
						</div>
					</div>
				}
			</div>
		)
	}
}
