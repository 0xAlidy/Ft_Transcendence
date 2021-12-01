import * as React from "react";
import '../../../styles/MainPage/menu/menu.css'
import ACHIEVEMENT from '../../../assets/trophy.png'
import USER from '../../../assets/user.png'
import HISTORY from '../../../assets/scroll.png'
import ADMIN from '../../../assets/admin.png'
import SEARCH from '../../../assets/search.png'
export default class Menu extends React.Component{

	render(){
			return (
				<div className="menu">
					<img src="https://cdn.intra.42.fr/users/medium_default.png" height="100px"  className="PP"/>
					<div className="menuContainer">
						<div className="menuButton">
							<div className="horizontal">
								<img src={USER} className="menuIcon"/>
								PROFILE
							</div>
						</div>
						<div className="menuButton">
							<div className="horizontal">
								<img src={SEARCH} className="menuIcon"/>
								SEARCH
							</div>
						</div>
						<div className="menuButton">
							<div className="horizontal">
								<img src={ACHIEVEMENT} className="menuIcon"/>
								TROPHY
							</div>
						</div>
						<div className="menuButton">
							<div className="horizontal">
								<img src={HISTORY} className="menuIcon"/>
								HISTORY
							</div>
						</div>
						<div className="menuButton">
							<div className="horizontal">
								<img src={ADMIN} className="menuIcon"/>
								ADMIN
							</div>
						</div>
					</div>
				</div>
		)
	}
}
