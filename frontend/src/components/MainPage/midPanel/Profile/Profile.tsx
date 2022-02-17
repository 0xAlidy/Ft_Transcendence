import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/Profile/Profile.css'
import EditBox from './editBox';
import Gauge from './gauge';
import WinRate from './winRate';
import TwoAuth from './twoAuth';
import ProfileImg from './ProfileImg';
import axios from 'axios';

interface user{
	WSId: string;
	id: number;
	imgUrl: string;
	isActive: false;
	lvl: number;
	login: string;
	nickname: string;
	numberOfLoose: number;
	numberOfWin: number;
	secret: string;
	secretEnabled: false;
	firstConnection: boolean;
	token: string;
	xp: 0;
}

export default class Profile extends React.Component<{token:string, refreshUser:any},{User:user|null, nickname:string}>{
	constructor(props:any)
	{
		super(props)
		this.state = {
			User:null,
			nickname: "",
		}
		this.setName = this.setName.bind(this);
	}

	setName(nickname:string){
		this.setState({ nickname: nickname });
	};

	handleRefresh = () => {
		//this.props.refreshUser()
	}

	async componentDidMount(){
		await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/auth/me?token=" + this.props.token).then(res => {
			this.setState({User: res.data, nickname: res.data.nickname})
		})

		const box = document.getElementById("boxProfile");
		const shadow = document.getElementById("shadow");
		const title = document.getElementById("title");
		if (box !== null && shadow !== null && title !== null)
			box.addEventListener("scroll", function() { 
				if (this.scrollTop > 47)
				{
					shadow.style.boxShadow= "0px -11px 20px 13px #fee154";
					title.style.boxShadow= "none";
				}
				else
					title.style.boxShadow= "0px 16px 13px 0px hsl(0deg 0% 7%)";
			});
	
	};

	render(){
		return (
        <div className="midPanel" >
			{this.state.User && <div id="profile">
				<h1 id="title">Profile</h1>
				<span id="shadow"></span>
				<div id="boxProfile">
					<div id="topBox">
						<div id="player">
							<h2>Player</h2>
							<ProfileImg User={this.state.User} refreshUser={this.handleRefresh}/>
							<EditBox value={this.state.nickname} onChange={this.setName} User={this.state.User}/>
						</div>
						<div id="statistics">
							<h2>Statistics</h2>
							<Gauge percent={this.state.User.xp.toString()} lvl={this.state.User.lvl.toString()}/>
							<WinRate win={this.state.User.numberOfWin} loose={this.state.User.numberOfLoose}/>
						</div>
					</div>
					<div id="security">
						<h2>Security</h2>
						<TwoAuth token={this.state.User.token}/>
					</div>
				</div>
			</div>}
		</div>
    	)
	}
};
