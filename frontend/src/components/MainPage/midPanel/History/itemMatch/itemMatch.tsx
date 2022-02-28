import * as React from "react";
import ProfileShortCut from "../../../ProfileShortcut";
import '../../../../../styles/MainPage/midPanel/History/History.css'
import Nickname from "../../../../utility/utility";
import { Socket } from "socket.io-client";
import { user } from "../../../MainPage";

export default class ItemMatch extends React.Component<{match:string, name:any, socket:Socket, user:user},{isArcade:boolean,WinnerName:any, WinnerScore:any, LooserName:any, LooserScore:any}>{
	constructor(props:any) {
		super(props)
		var arr = this.props.match.split('/');
		this.state = {
			WinnerName: arr.at(0),
			WinnerScore: arr.at(1),
			LooserName: arr.at(2),
			LooserScore: arr.at(3),
			isArcade: (arr.at(4) === 'true' ? true:false)
		}
		console.log("isArcade" + this.state.isArcade)
	};
	render(){
		return (
			<>
			{
				this.props.name === this.state.WinnerName ?
				<div className="itemMatch itemMatch-win">
					<div className="item-match-section">
						<ProfileShortCut pseudo={this.props.name} user={this.props.user} socket={this.props.socket} />
						<div className="name">
						<Nickname login={this.state.WinnerName}/>
						</div>
						<div className="score">
							{this.state.WinnerScore}
						</div>
					</div>
					<h2 className="vs">VS</h2>
					<div className="item-match-section">
						<div className="score">
							{this.state.LooserScore}
						</div>
						<div className="name">
						<Nickname login={this.state.LooserName}/>
						</div>
						<ProfileShortCut pseudo={this.state.LooserName} user={this.props.user} socket={this.props.socket} />
					</div>
				</div>
				:
				<div className="itemMatch itemMatch-lose">
					<div className="item-match-section">
						<ProfileShortCut pseudo={this.props.name} user={this.props.user} socket={this.props.socket} />
						<div className="name">
						<Nickname login={this.state.LooserName}/>
						</div>
						<div className="score">
							{this.state.LooserScore}
						</div>
					</div>
					<h2 className="vs">VS</h2>
					<div className="item-match-section">
						<div className="score">
							{this.state.WinnerScore}
						</div>
						<div className="name">
						<Nickname login={this.state.WinnerName}/>
						</div>
						<ProfileShortCut pseudo={this.state.WinnerName} user={this.props.user} socket={this.props.socket} />
					</div>
				</div>
			}
			</>
		)
	}
};
