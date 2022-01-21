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

export default class Profile extends React.Component<{token:string, name:string},{editMode:boolean}>{
	async componentDidMount(){

	}
	render(){
		return (
        <div className="midPanel" id="profile">
			<ProfileImg name={this.props.name}/>
			<EditBox value={this.props.name} placeHolder="nickname"/>
			<Gauge percent="56" lvl="45"/>
			<WinRate win={80} loose={45}/>
			<TwoAuth token={this.props.token}/>
			{/* <img src={LEAVE} alt="" width="50px"/>
			<img src={DELETE} alt="" width="50px" /> */}
		</div>
    	)
	}
};
