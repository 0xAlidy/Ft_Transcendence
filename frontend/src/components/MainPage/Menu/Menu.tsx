import * as React from "react";
import '../../../styles/MainPage/menu/menu.css'
// import USER from '../../../assets/user.png'
import HISTORY from '../../../assets/scroll.png'
import ADMIN from '../../../assets/admin.png'
import VERSUS from '../../../assets/versus.png'
export default class Menu extends React.Component<{onChange : any, imgsrc:string}, {isFriendListOpen:boolean, isProfileOpen: boolean, isGameOpen: boolean, isHistoryOpen: boolean, isAdminOpen: boolean}>{
	constructor(props :any) {
		super(props);
		this.handleProfileClick = this.handleProfileClick.bind(this);
		this.handleFriendClick = this.handleFriendClick.bind(this);
		this.handleGameClick = this.handleGameClick.bind(this);
		this.handleHistoryClick = this.handleHistoryClick.bind(this);
		this.handleAdminClick = this.handleAdminClick.bind(this);
		this.state = {isProfileOpen: false, isGameOpen: true, isHistoryOpen: false, isAdminOpen: false, isFriendListOpen:false};
	}
	async handleFriendClick(){
		this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false , isFriendListOpen:true})
	}
	async handleProfileClick() {
		await this.setState({isProfileOpen: true, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false , isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	async handleGameClick() {
		await this.setState({isProfileOpen: false, isGameOpen: true, isHistoryOpen: false, isAdminOpen: false, isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	async handleAchievClick(){
		await this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false, isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	async handleHistoryClick(){
		await this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: true, isAdminOpen: false, isFriendListOpen:false});
		this.props.onChange(this.state);
	}
	async handleAdminClick(){
		await this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: true, isFriendListOpen:false});
		this.props.onChange(this.state);
	}
		getState(){
			return this.state;
		}
	render(){

		var isProfileOpen = this.state.isProfileOpen;
		var isFriendOpen = this.state.isFriendListOpen;
		var isGameOpen = this.state.isGameOpen;
		var isHistoryOpen = this.state.isHistoryOpen;
		var isAdminOpen = this.state.isAdminOpen;
		const renderProfile = () => {
			if (!isProfileOpen) {
				return <div className="menuButton" onClick={this.handleProfileClick}><div className="horizontal"><img src={this.props.imgsrc}  alt="" className="menuIconProfile"/>PROFILE</div></div>;
			}
			return;
		  }
		  const renderVersus = () => {
				if (!isGameOpen) {
					return <div className="menuButton" onClick={this.handleGameClick}><div className="horizontal"><img src={VERSUS}  alt="" className="menuIcon"/>VERSUS</div></div>
				}
				return;
			}
			const renderHistory = () => {
				if (!isHistoryOpen) {
					return <div className="menuButton" onClick={this.handleHistoryClick}><div className="horizontal"><img src={HISTORY} alt=""  className="menuIcon"/>HISTORY</div></div>
				}
				return;
			}
			const renderAdmin = () => {
				if (!isAdminOpen) {
					return <div className="menuButton" onClick={this.handleAdminClick}><div className="horizontal"><img src={ADMIN}  alt="" className="menuIcon"/>ADMIN</div></div>
				}
				return;
				}
			const renderFriend = () => {
				if (!isFriendOpen) {
					return <div className="menuButton" onClick={this.handleAdminClick}><div className="horizontal"><img src={ADMIN}  alt="" className="menuIcon"/>FRIENDS</div></div>
				}
				return;
				}
		return (
				<div className="menu">
					<div className="menuContainer">
						{renderProfile()}
						{renderVersus()}
						{renderHistory()}
						{renderAdmin()}
						{renderFriend()}
						</div>
				</div>
		)
	}
}
