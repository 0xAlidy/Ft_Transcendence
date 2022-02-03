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
interface user{
	WSId: string;
	id: number;
	imgUrl: string;
	isActive: false;
	lvl: number;
	name: string;
	nickname: string;
	numberOfLoose: number;
	numberOfWin: number;
	secret: string;
	secretEnabled: false;
	firstConnection: boolean;
	token: string;
	xp: 0;
}
export default class Profile extends React.Component<{User:user, name:string, refreshUser:any},{}>{
	async componentDidMount(){

	}
	handleRefresh = () => {
		this.props.refreshUser()
	}
	render(){
		return (
        <div className="midPanel" id="profile">
			<h1>Profile</h1>
			<ProfileImg User={this.props.User} refreshUser={this.handleRefresh}/>
			<EditBox value={this.props.User.name} onChange={() => {}} />
			<h1>Statistics</h1>
			<Gauge percent={this.props.User.xp.toString()} lvl={this.props.User.lvl.toString()}/>
			<WinRate win={this.props.User.numberOfWin} loose={this.props.User.numberOfLoose}/>
			<h1>Security</h1>
			<TwoAuth token={this.props.User.token}/>
			{/* <img src={LEAVE} alt="" width="50px"/>
			<img src={DELETE} alt="" width="50px" /> */}
		</div>
    	)
	}
};
