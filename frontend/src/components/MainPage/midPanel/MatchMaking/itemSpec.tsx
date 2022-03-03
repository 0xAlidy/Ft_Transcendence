import axios from "axios";
import * as React from "react";
import { Socket } from "socket.io-client";
import { User } from "../../../../interfaces";
import ProfileShortCut from "../../ProfileShortcut";
import { specRooms } from "../../../../interfaces";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore 
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class ItemSpec extends React.Component<{data:specRooms, user:User, onSpecCLick:any, socket:Socket},{left:string|null, right:string|null}>{
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
		const shadow = document.getElementById("shadow");
		const title = document.getElementById("vsPanelMenu");
		const box = document.getElementById("spectatePanel");
		if (box !== null && shadow !== null && title !== null)
			box.addEventListener("scroll", function() {
				if (this.scrollTop > 25)
				{
					shadow.style.boxShadow= "0px -11px 20px 13px var(--main-color)";
					title.style.boxShadow= "none";
				}
				else
					title.style.boxShadow= "0px 16px 13px 0px hsl(0deg 0% 7%)";
			});
	}

	specClick = () =>{
		this.props.onSpecCLick(this.props.data.name);
	}

	render(){
		return (
			this.state.left && this.state.right &&
			<div className="itemSpec">
				<div className="matchBox">
					<div className="player">
						<ProfileShortCut login={this.props.data.left} User={this.props.user} socket={this.props.socket}/>
						<h3>{this.state.left}</h3>
					</div>
					<div className="versusBox">
						{
							this.props.data.arcade ?
							<FontAwesomeIcon className="versusLogo" icon={solid('hat-wizard')}/>
							:
							<FontAwesomeIcon className="versusLogo" icon={solid('hand-fist')}/>
						}					
					</div>
					<div className="player">
						<ProfileShortCut  login={this.props.data.right} User={this.props.user} socket={this.props.socket}/>
						<h3>{this.state.right}</h3>
					</div>
				</div>
				<div className="specButtonBox">
						<button className="specButton" onClick={this.specClick}>Spectate</button>
				</div>
			</div>
		)
	}
}
