import * as React from "react";
import  Logo from '../../../../../assets/versus.png'

interface Match {
	NameA:string;
	NameB:string;
	ScoreA:number;
	ScoreB:number;
	Time:number;
	id:number;
}


export default class ItemMatch extends React.Component<{match:Match, id:number},{color:string}>{
	constructor(props:any) {
		super(props)
		if (this.props.match.ScoreA > this.props.match.ScoreB)
			this.state = {color:"#fee154"};
		else
			this.state = {color:"none"};
	};
	defineColor = () => {
		var items:any = document.getElementsByClassName('itemMatch');
        for (let i = 0; i < items.length; i++) {
			console.log("efrejnzngvezrjnfeivzrniverz");
			items[i].style.background = '#2B2B2B'
        }
	}
	render(){
		return (

			<div className="itemMatch" style={{backgroundColor:this.state.color}} id="itemMatch" >
				<img src="https://cdn.intra.42.fr/users/medium_default.png"  className="imgProfile" height="80%" alt=""/>
				<div className="name">{this.props.match.NameA}</div>
				<div className="Score">{this.props.match.ScoreA}</div>
				<img src={Logo} height="80%" alt="" className="Logo"/>
				<div className="Score">{this.props.match.ScoreB}</div>
				<div className="name">{this.props.match.NameB}</div>
				<img src="https://cdn.intra.42.fr/users/medium_default.png"  className="imgProfile" height="80%" alt=""/>
		</div>
				
    	)
	}
};
