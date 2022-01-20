import * as React from "react";

export default class ItemMatch extends React.Component<{match:string, name:any},{WinnerName:any, WinnerScore:any, LooserName:any, LooserScore:any}>{
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
			<div className="itemMatch" style={{backgroundColor : this.props.name === this.state.WinnerName ? '#fee154': '#2c2c2c'}} id="itemMatch" >
				<img src={"https://cdn.intra.42.fr/users/small_"+( this.props.name === this.state.WinnerName ? this.state.WinnerName: this.state.LooserName) + ".jpg"}  className="imgProfile" height="80%" alt=""/>
				<div className="name">
					{this.props.name === this.state.WinnerName ? this.state.WinnerName: this.state.LooserName}
				</div>
				<div className="Score">
					{this.props.name === this.state.WinnerName ? this.state.WinnerScore: this.state.LooserScore}
				</div>
				<div className="vs" style={{fontSize:'80%', textAlign:'center'}}>
					VS
				</div>
				<div className="Score">
					{this.props.name === this.state.WinnerName ? this.state.LooserScore: this.state.WinnerScore}
				</div>
				<div className="name">
					{this.props.name === this.state.WinnerName ? this.state.LooserName: this.state.WinnerName}
				</div>
				<img src={"https://cdn.intra.42.fr/users/small_"+ (this.props.name === this.state.WinnerName ? this.state.LooserName: this.state.WinnerName) + ".jpg"}  className="imgProfile" height="80%" alt=""/>
		</div>

    	)
	}
};
