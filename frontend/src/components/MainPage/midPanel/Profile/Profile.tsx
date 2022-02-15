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

export default class Profile extends React.Component<{token:string, refreshUser:any},{User:user|null}>{
	constructor(props:any)
	{
		super(props)
		this.state = {User:null}
	}
	handleRefresh = () => {
		this.props.refreshUser()
	}

	async componentDidMount(){
		await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/auth/me?token=" + this.props.token).then(res => {
			this.setState({User: res.data})
		})
	}
	render(){
		return (
        <div className="midPanel" >
			{this.state.User && <div id="profile">
				<div id="player">
					<h1>Player</h1>
					<ProfileImg User={this.state.User} refreshUser={this.handleRefresh}/>
					<EditBox value={this.state.User.nickname} onChange={() => {}} User={this.state.User} refreshUser={this.handleRefresh}/>
				</div>
				<div id="statistics">
					<h1>Statistics</h1>
					<Gauge percent={this.state.User.xp.toString()} lvl={this.state.User.lvl.toString()}/>
					<WinRate win={this.state.User.numberOfWin} loose={this.state.User.numberOfLoose}/>
				</div>
				<div id="security">
					<h1>Security</h1>
					<TwoAuth token={this.state.User.token}/>
				</div>
			</div>}
		</div>
    	)
	}
};
