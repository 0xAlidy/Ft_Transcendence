import axios from "axios";
import * as React from "react";
import ProfileShortCut from "../../ProfileShortcut";

interface specRoomsData{
	name:string,
	left:string,
	right:string,
}
export default class ItemSpec extends React.Component<{data:specRoomsData, token:string, onSpecCLick:any},{left:string|null, right:string|null}>{
	constructor(props:any)
	{
		super(props);
		this.state = {left:null, right:null}
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
		return	(
				<div className="itemSpec">
					{this.state.left && this.state.right &&
					<div className="grid">
						<div className="imgLeft">
								<ProfileShortCut canOpen={true} pseudo={this.props.data.left} token={this.props.token}/>
						</div>
						<div className="imgRight">
								<ProfileShortCut canOpen={true} pseudo={this.props.data.right} token={this.props.token}/>
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
					</div>}
				</div>)
	}
}
