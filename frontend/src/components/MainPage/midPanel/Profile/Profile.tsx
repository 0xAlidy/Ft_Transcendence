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
export default class Profile extends React.Component<{User:user, name:string},{editMode:boolean}>{
	async componentDidMount(){

	}
	render(){
		return (
        <div className="midPanel" id="profile">
			<ProfileImg User={this.props.User} refreshUser={()=> {}}/>
			<EditBox value={this.props.name} onChange={() => {}} />
			<Gauge percent="56" lvl="45"/>
			<WinRate win={80} loose={45}/>
			<TwoAuth token={this.props.User.token}/>
			{/* <img src={LEAVE} alt="" width="50px"/>
			<img src={DELETE} alt="" width="50px" /> */}
		</div>
    	)
	}
};
