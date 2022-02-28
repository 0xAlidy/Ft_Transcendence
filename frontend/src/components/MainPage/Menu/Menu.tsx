import React from "react";
import '../../../styles/MainPage/menu/menu.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import ColorMenu from './ColorMenu/ColorMenu';
// import { Socket } from "socket.io-client";

export default class Menu extends React.Component<{selector:any, token:string, onChange :(selector:string) => void, imgsrc:string}, {}>{
	constructor(props :any) {
		super(props);
	}

	handleFriendClick = () => {
		this.props.onChange('friends')
	}

	handleProfileClick = () =>{
		this.props.onChange('profile')
	}

	handleGameClick = () =>{
		this.props.onChange('game')
	}

	handleHistoryClick = () =>{
		this.props.onChange('history')
	}

	handleAdminClick = () =>{
		this.props.onChange('admin')
	}

	handleRulesClick = () =>{
		this.props.onChange('rules')
	}

	render(){
		return (
			<div className="menu">
				<ColorMenu token={this.props.token}/>
				<nav id="menuContainer">
					{
						this.props.selector !== 'profile' &&
						<div className="menuButton" onClick={this.handleProfileClick}>
							<img src={this.props.imgsrc}  alt="profileImg" id="iconProfile"/>
							<h2> PROFILE</h2>
						</div>
					}
					{
						this.props.selector !== 'game' &&
						<div className="menuButton" onClick={this.handleGameClick}>
							<FontAwesomeIcon className="icon" icon={solid('hand-fist')}/>
							<h2> VERSUS</h2>
						</div>
					}
					{
						this.props.selector !== 'history' &&
						<div className="menuButton" onClick={this.handleHistoryClick}>
							<FontAwesomeIcon className="icon" icon={solid('table-list')}/>
							<h2> HISTORY</h2>
						</div>
					}
					{
						this.props.selector !== 'admin' &&
						<div className="menuButton" onClick={this.handleAdminClick}>
							<FontAwesomeIcon className="icon" icon={solid('wrench')}/>
							<h2> ADMIN</h2>
						</div>
					}
					{
						this.props.selector !== 'friends' &&
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
