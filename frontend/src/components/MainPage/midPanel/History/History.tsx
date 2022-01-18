import * as React from "react";
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/History/History.css'
// import  Logo from '../../../../assets/versus.png'
import ItemMatch from './itemMatch/itemMatch'
import axios from "axios";

interface Match {
	id:number;
	WinnerName:string;
	WinnerScore:number;
	LooserName:string;
	LooserScore:number;
}


export default class History extends React.Component<{name:string},{}>{
	MatchList: Match[] = [];
	constructor(props:any) {
		super(props)
	};


	loadMatchs = () => {
		console.log(this.MatchList.length);
		var matchDiv = [];
		if (this.MatchList.length > 0){
			console.log('heeeeree')
			this.MatchList.forEach(element => {
				matchDiv.push(this.createMatchElement(element))
			});
		}
		else
			matchDiv.push(
				<div>no old match :/</div>
			)
		return matchDiv;
	};

	createMatchElement = (newMatch:Match) => {
		return (
				<ItemMatch match={newMatch} name={this.props.name} key={newMatch.id}/>
		)
	};

	async componentDidMount() {
		this.MatchList = (await axios.get("http://localhost:667/matchs?name="+ this.props.name)).data;
		console.log(this.MatchList.length);
	}

	render(){
		return (
        <div className="midPanel" id="history">
			{this.loadMatchs()}
		</div>
    	)
	}
};
