import * as React from "react";
import ProfileShortCut from "../../../ProfileShortcut";

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
				<div className="itemMatch" style={{backgroundColor :'#fee154'}} id="itemMatch" >
					<div className="pp" key={'left'}>
						<ProfileShortCut pseudo={this.props.name} token={this.props.token} canOpen={false}/>
					</div>
					<div className="name">
						{this.state.WinnerName}
					</div>
					<div className="Score">
						{this.state.WinnerScore}
					</div>
					<div className="vs" style={{fontSize:'80%', textAlign:'center'}}>
						VS
					</div>
					<div className="Score">
						{this.state.LooserScore}
					</div>
					<div className="name">
						{this.state.LooserName}
					</div>
					<div className="pp" key={'right'}>
						<ProfileShortCut pseudo={this.state.LooserName} token={this.props.token} canOpen={true}/>
					</div>
				</div>
				:
				<div className="itemMatch" style={{backgroundColor :'#2c2c2c'}} id="itemMatch" >
					<div className="pp" key={'left'}>
						<ProfileShortCut pseudo={this.props.name} token={this.props.token} canOpen={false}/>
					</div>
					<div className="name">
						{this.state.LooserName}
					</div>
					<div className="Score">
						{this.state.LooserScore}
					</div>
					<div className="vs" style={{fontSize:'80%', textAlign:'center'}}>
						VS
					</div>
					<div className="Score">
						{this.state.WinnerScore}
					</div>
					<div className="name">
						{this.state.WinnerName}
					</div>
					<div className="pp" key={'right'}>
						<ProfileShortCut pseudo={this.state.WinnerName} token={this.props.token} canOpen={true}/>
					</div>
				</div>
			}
			</>
		)
	}
};
