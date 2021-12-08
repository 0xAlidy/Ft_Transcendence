import React from 'react'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/Profile/Profile.css'

export default class Profile extends React.Component<{},{editMode:boolean}>{
	constructor(props :any){
		super(props)
	}

	render(){
		return (
        <div className="midPanel" id="profile">
			<img src="https://cdn.intra.42.fr/users/medium_default.png" className="profileImg"/>
			<editBox value="saucisson" />
			<div className="profilePseudo">edepauw</div>
			<div className="profileLogout"></div>
			<div className="profileDelete"></div>
		</div>
    	)
	}
};
