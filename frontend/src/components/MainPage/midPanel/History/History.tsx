import * as React from "react";
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/History/History.css'
import  Logo from '../../../../assets/versus.png'
import ItemMatch from './itemMatch/itemMatch'

interface Match {
	NameA:string;
	NameB:string;
	ScoreA:number;
	ScoreB:number;
	Time:number;
	id:number;
}


export default class History extends React.Component<{},{}>{
	MatchList: Match[] = [];
	match1: Match = {NameA:"stringA", NameB:"stringB", ScoreA:10, ScoreB:2, Time:Date.now(), id:1}
	match2: Match = {NameA:"toto", NameB:"tata", ScoreA:2, ScoreB:20, Time:Date.now(),id:2}
	match3: Match = {NameA:"stringA", NameB:"stringB", ScoreA:10, ScoreB:2, Time:Date.now(),id:3}
	match4: Match = {NameA:"toto", NameB:"tata", ScoreA:10, ScoreB:20, Time:Date.now(),id:4}
	match5: Match = {NameA:"stringA", NameB:"stringB", ScoreA:10, ScoreB:20, Time:Date.now(),id:5}
	match6: Match = {NameA:"toto", NameB:"tata", ScoreA:10, ScoreB:20, Time:Date.now(),id:6}
	match7: Match = {NameA:"stringA", NameB:"stringB", ScoreA:10, ScoreB:2, Time:Date.now(),id:7}
	match8: Match = {NameA:"toto", NameB:"tata", ScoreA:10, ScoreB:2, Time:Date.now(),id:8}
	match9: Match = {NameA:"stringA", NameB:"stringB", ScoreA:10, ScoreB:2, Time:Date.now(),id:9}
	match0: Match = {NameA:"toto", NameB:"tata", ScoreA:10, ScoreB:2, Time:Date.now(),id:0}
	constructor(props:any) {
		super(props)
		this.MatchList.push(this.match1);
		this.MatchList.push(this.match2);
		this.MatchList.push(this.match3);
		this.MatchList.push(this.match4);
		this.MatchList.push(this.match5);
		this.MatchList.push(this.match6);
		this.MatchList.push(this.match7);
		this.MatchList.push(this.match8);
		this.MatchList.push(this.match9);
		this.MatchList.push(this.match0);
	};

	
	addMatch = () => {
		console.log(Logo);
		var matchDiv = [];
		if (this.MatchList.length > 0){
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
				<ItemMatch match={newMatch} id={newMatch.id}/>
		)
	};



	render(){
		return (
        <div className="midPanel" id="history">
			{this.addMatch()}
		</div>
    	)
	}
};
