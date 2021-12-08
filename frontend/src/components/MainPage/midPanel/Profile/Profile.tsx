import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/Profile/Profile.css'
import DELETE from '../../../../assets/delete.png'
import LEAVE from '../../../../assets/exit.png'
import EditBox from './editBox';
export default class Profile extends React.Component<{},{editMode:boolean}>{
	constructor(props :any){
		super(props)
	}
	render(){
		return (
        <div className="midPanel" id="profile">
			<img src="https://cdn.intra.42.fr/users/medium_default.png" className="profileImg"/>
			<EditBox value="login" placeHolder="nickname"/>
			<img src={LEAVE} alt="" width="50px"/>
			<img src={DELETE} alt="" width="50px" />
		</div>
    	)
	}
};
