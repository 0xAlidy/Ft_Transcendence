import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/Profile/Profile.css'
// import DELETE from '../../../../assets/delete.png'
// import LEAVE from '../../../../assets/exit.png'
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
	}

	render(){
		return (
        <div className="midPanel" >
			{this.state.User && <div id="profile">
				<h1>Profile</h1>
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
