import React from "react";
import '../../../styles/MainPage/menu/menu.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore 
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import ColorMenu from './ColorMenu/ColorMenu';

export default class Menu extends React.Component<{onChange : any, imgsrc:string}, {isFriendListOpen:boolean, isProfileOpen: boolean, isGameOpen: boolean, isHistoryOpen: boolean, isAdminOpen: boolean, isRulesOpen: boolean}>{
	constructor(props :any) {
		super(props);
		this.state = {
			isProfileOpen: false,
			isGameOpen: true,
			isHistoryOpen: false,
			isAdminOpen: false,
			isFriendListOpen:false,
			isRulesOpen:false,
		};
		this.handleAdminClick = this.handleAdminClick.bind(this);
		this.handleFriendClick = this.handleFriendClick.bind(this);
		this.handleGameClick = this.handleGameClick.bind(this);
		this.handleHistoryClick = this.handleHistoryClick.bind(this);
		this.handleProfileClick = this.handleProfileClick.bind(this);
		this.handleRulesClick= this.handleRulesClick.bind(this);
	}

	handleFriendClick(){
		this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false , isFriendListOpen:true, isRulesOpen:false}, () => {this.props.onChange(this.state)});
	}

	handleProfileClick(){
		this.setState({isProfileOpen: true, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false , isFriendListOpen:false, isRulesOpen:false}, () => { this.props.onChange(this.state)});
	}

	handleGameClick(){
		this.setState({isProfileOpen: false, isGameOpen: true, isHistoryOpen: false, isAdminOpen: false, isFriendListOpen:false, isRulesOpen:false}, () => {this.props.onChange(this.state)});
	}

	handleHistoryClick(){
		this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: true, isAdminOpen: false, isFriendListOpen:false, isRulesOpen:false}, () => {this.props.onChange(this.state)});
	}

	handleAdminClick(){
		this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: true, isFriendListOpen:false, isRulesOpen:false}, () => {this.props.onChange(this.state)});
	}

	handleRulesClick(){
		this.setState({isProfileOpen: false, isGameOpen: false, isHistoryOpen: false, isAdminOpen: false, isFriendListOpen:false, isRulesOpen:true}, () => { this.props.onChange(this.state)});
	}

	render(){
		return (
			<div className="menu">
				<ColorMenu/>
				<nav id="menuContainer">
					{
						!this.state.isProfileOpen &&
						<div className="menuButton" onClick={this.handleProfileClick}>
							<img src={this.props.imgsrc}  alt="profileImg" id="iconProfile"/>
							<h2> PROFILE</h2>
						</div>
					}
					{
						!this.state.isGameOpen &&
						<div className="menuButton" onClick={this.handleGameClick}>
							<FontAwesomeIcon className="icon" icon={solid('hand-fist')}/>
							<h2> VERSUS</h2>
						</div>
					}
					{
						!this.state.isHistoryOpen &&
						<div className="menuButton" onClick={this.handleHistoryClick}>
							<FontAwesomeIcon className="icon" icon={solid('table-list')}/>
							<h2> HISTORY</h2>
						</div>
					}
					{
						!this.state.isAdminOpen &&
						<div className="menuButton" onClick={this.handleAdminClick}>
							<FontAwesomeIcon className="icon" icon={solid('wrench')}/>
							<h2> ADMIN</h2>
						</div>
					}
					{
						!this.state.isFriendListOpen &&
						<div className="menuButton" onClick={this.handleFriendClick}>
							<FontAwesomeIcon className="icon" icon={solid('user-group')}/>
							<h2> FRIENDS</h2>
						</div>
					}
				</nav>
				<div id="rules">
					<h2 onClick={this.handleRulesClick}>Rules</h2>
				</div>
			</div>
		)
	}
}
