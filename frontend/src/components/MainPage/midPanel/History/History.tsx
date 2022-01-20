import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/History/History.css'
// import  Logo from '../../../../assets/versus.png'
import ItemMatch from './itemMatch/itemMatch'
import axios from "axios";


export default class History extends React.Component<{name:string},{matchs:string[], name:string}>{
	MatchList: any = [];
	constructor(props:any) {
		super(props)
		this.state={
				matchs:[],
				name:this.props.name
			}
	};

	// loadMatchs = async () => {
	// 	console.log(this.MatchList.length);
	// 	var matchDiv = [];
	// 	if (this.MatchList.length > 0){
	// 		console.log('heeeeree')
	// 		this.MatchList.forEach(element => {
	// 			matchDiv.push(this.createMatchElement(element))
	// 		});
	// 	}
	// 	else
	// 		matchDiv.push(
	// 			<div>no old match :/</div>
	// 		)
	// 	return matchDiv;
	// };

	// createMatchElement = (newMatch:Match) => {
	// 	return (
	// 			<ItemMatch match={newMatch} name={this.props.name} key={newMatch.id}/>
	// 	)
	async componentDidMount() {
		var data = (await axios.get("http://localhost:667/matchs?name="+ this.props.name)).data;
		this.setState({matchs: data});
	}

	render(){
		return (
        <div className="midPanel" id="history">
			{
			this.state.matchs.map((function(item, idx) {
                    return <ItemMatch match={item} name={item.split('/').at(4)} key={idx}/>;
                }))}
		</div>
    	)
	}
};
