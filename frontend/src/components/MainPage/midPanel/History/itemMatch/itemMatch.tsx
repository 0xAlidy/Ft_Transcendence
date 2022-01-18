import * as React from "react";

interface Match {
	id:number;
	WinnerName:string;
	WinnerScore:number;
	LooserName:string;
	LooserScore:number;
}


export default class ItemMatch extends React.Component<{match:Match, name:string},{}>{
	constructor(props:any) {
		super(props)
	};
	render(){
		return (
			<div className="itemMatch" style={{color : this.props.name === this.props.match.WinnerName ? '#fee154': '#2c2c2c'}} id="itemMatch" >
				<img src="https://cdn.intra.42.fr/users/medium_default.png"  className="imgProfile" height="80%" alt=""/>
				<div className="name">
					{this.props.name === this.props.match.WinnerName ? this.props.match.WinnerName: this.props.match.LooserName}
				</div>
				<div className="Score">
					{this.props.name === this.props.match.WinnerName ? this.props.match.WinnerScore: this.props.match.LooserScore}
				</div>
				<div className="vs" style={{fontSize:'80%', textAlign:'center'}}>
					VS
				</div>
				<div className="Score">
					{this.props.name === this.props.match.WinnerName ? this.props.match.LooserName: this.props.match.WinnerName}
				</div>
				<div className="name">
					{this.props.name === this.props.match.WinnerName ? this.props.match.LooserScore: this.props.match.WinnerScore}
				</div>
				<img src="https://cdn.intra.42.fr/users/medium_default.png"  className="imgProfile" height="80%" alt=""/>
		</div>

    	)
	}
};
