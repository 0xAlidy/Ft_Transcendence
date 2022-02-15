import * as React from "react";
import '../../../styles/MainPage/menu/menu.css'
// import USER from '../../../assets/user.png'
import HISTORY from '../../../assets/scroll.png'
import FRIEND from '../../../assets/friends.png'
import ADMIN from '../../../assets/admin.png'
import VERSUS from '../../../assets/versus.png'
export default class Menu extends React.Component<{onChange : any, imgsrc:string}, {isFriendListOpen:boolean, isProfileOpen: boolean, isGameOpen: boolean, isHistoryOpen: boolean, isAdminOpen: boolean}>{
	constructor(props :any) {
		super(props);
		this.state = {isProfileOpen: false, isGameOpen: true, isHistoryOpen: false, isAdminOpen: false, isFriendListOpen:false};
	}
	handleFriendClick =  async() =>{
		await this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false , isFriendListOpen:true})
		this.props.onChange(this.state);
	}
	handleProfileClick = async() =>{
		await this.setState({isProfileOpen: true, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false , isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	handleGameClick = async() =>{
		await this.setState({isProfileOpen: false, isGameOpen: true, isHistoryOpen: false, isAdminOpen: false, isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	handleAchievClick = async() =>{
		await this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false, isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	handleHistoryClick = async() =>{
		await this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: true, isAdminOpen: false, isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	handleAdminClick = async() =>{
		await this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: true, isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	getState(){
		return this.state;
	}
	render(){
		return (
				<div className="menu">
					<div className="menuContainer">
						{!this.state.isProfileOpen && <div className="menuButton" onClick={this.handleProfileClick}><div className="horizontal"><img src={this.props.imgsrc}  alt="" className="menuIconProfile"/>PROFILE</div></div>}
						{!this.state.isGameOpen && <div className="menuButton" onClick={this.handleGameClick}><div className="horizontal"><img src={VERSUS}  alt="" className="menuIcon"/>VERSUS</div></div>}
						{!this.state.isHistoryOpen &&  <div className="menuButton" onClick={this.handleHistoryClick}><div className="horizontal"><img src={HISTORY} alt=""  className="menuIcon"/>HISTORY</div></div>}
						{!this.state.isAdminOpen && <div className="menuButton" onClick={this.handleAdminClick}><div className="horizontal"><img src={ADMIN}  alt="" className="menuIcon"/>ADMIN</div></div>}
						{!this.state.isFriendListOpen && <div className="menuButton" onClick={this.handleFriendClick}><div className="horizontal"><img src={FRIEND}  alt="" className="menuIcon"/>FRIENDS</div></div>}
						</div>
				</div>
		)
	}
}
