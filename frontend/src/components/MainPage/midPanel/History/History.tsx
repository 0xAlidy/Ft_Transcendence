import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/History/History.css'
import ItemMatch from './itemMatch/itemMatch'
import axios from "axios";
import { User } from '../../../../interfaces';
import { Socket } from 'socket.io-client';


export default class History extends React.Component<{login:string|null, User:User, socket:Socket},{matchs:string[]}>{
	MatchList: any = [];
	constructor(props:any) {
		super(props)
		this.state={
				matchs:[],
			}
	};

	async componentDidMount() {
		await axios.get("http://" + window.location.host.split(":").at(0) + ":667/matchs?login="+ (this.props.login? this.props.login: this.props.User.login) +"&token="+ this.props.User.token).then(res => {
			this.setState({matchs: res.data});
		})
		const box = document.getElementById("boxMatchs");
		const shadow = document.getElementById("shadow");
		const title = document.getElementById("title");
		if (box !== null && shadow !== null && title !== null)
			box.addEventListener("scroll", function() {
				if (this.scrollTop > 40)
				{
					shadow.style.boxShadow= "0px -11px 20px 13px var(--main-color)";
					title.style.boxShadow= "none";
				}
				else
					title.style.boxShadow= "0px 16px 13px 0px hsl(0deg 0% 7%)";
			});
	}

	async componentDidUpdate(prev:any) {
		if (prev.login !== this.props.login)
		{
			this.setState({matchs:[]});
			await axios.get("http://" + window.location.host.split(":").at(0) + ":667/matchs?login="+ (this.props.login? this.props.login: this.props.User.login) +"&token="+ this.props.User.token).then(res => {
				this.setState({matchs: res.data});
			})
		}
	}

	render(){
		return (
        <div className="midPanel">
			<div id="history">
				<h1 id="title">History</h1>
				<span id="shadow"></span>
				<div id="boxMatchs">
				{
					this.state.matchs.map((a, i, arr) => {
						return <ItemMatch match={arr[arr.length - 1 - i]} socket={this.props.socket} user={this.props.User} name={this.props.login? this.props.login: this.props.User.login} key={i}/>;
					})
				}
				</div>
			</div>
		</div>
    	)
	}
};
