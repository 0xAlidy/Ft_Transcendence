import * as React from "react";
import ProfileShortCut from "../../../ProfileShortcut";
import '../../../../../styles/MainPage/midPanel/History/History.css'
import Nickname from "../../../../utility/utility";

export default class ItemMatch extends React.Component<{match:string, name:any, token:any},{WinnerName:any, WinnerScore:any, LooserName:any, LooserScore:any}>{
	constructor(props:any) {
		super(props)
		var arr = this.props.match.split('/');
		this.state = {
			WinnerName: arr.at(0),
			WinnerScore: arr.at(1),
			LooserName: arr.at(2),
			LooserScore: arr.at(3)
		}
	};
	render(){
		return (
			<>
			{
				this.props.name === this.state.WinnerName ?
				<div className="itemMatch itemMatch-win">
					<div className="item-match-section">
						<ProfileShortCut pseudo={this.props.name} token={this.props.token} canOpen={false}/>
						<div className="name">
						<Nickname login={this.state.WinnerName}/>
						</div>
						<div className="score score-win">
							{this.state.WinnerScore}
						</div>
					</div>
					<h2 className="vs">VS</h2>
					<div className="item-match-section">
						<div className="score score-lose">
							{this.state.LooserScore}
						</div>
						<div className="name">
						<Nickname login={this.state.LooserName}/>
						</div>
						<ProfileShortCut pseudo={this.state.LooserName} token={this.props.token} canOpen={true}/>
					</div>
				</div>
				:
				<div className="itemMatch itemMatch-lose">
					<div className="item-match-section">
						<ProfileShortCut pseudo={this.props.name} token={this.props.token} canOpen={false}/>
						<div className="name">
						<Nickname login={this.state.LooserName}/>
						</div>
						<div className="score score-lose">
							{this.state.LooserScore}
						</div>
					</div>
					<h2 className="vs">VS</h2>
					<div className="item-match-section">
						<div className="score score-win">
							{this.state.WinnerScore}
						</div>
						<div className="name">
						<Nickname login={this.state.WinnerName}/>
						</div>
						<ProfileShortCut pseudo={this.state.WinnerName} token={this.props.token} canOpen={true}/>
					</div>
				</div>
			}
			</>
		)
	}
};
