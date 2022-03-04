import React from "react";
import '../../../styles/MainPage/menu/menu.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import ColorMenu from './ColorMenu/ColorMenu';
import { Socket } from "socket.io-client";
import { User } from '../../../interfaces';
//import axios from 'axios';

export default class Menu extends React.Component<{blocked:boolean, forceHistory:boolean, selector:any, User: User, onChange :(selector:string) => void, socket:Socket}, {img:string|null}>{
    constructor(props :any) {
        super(props);
        this.state = {
            img: null,
        }
    }

    handleFriendClick = () => {
        if(this.props.blocked)
            return;
        this.props.onChange('friends')
    }

    handleProfileClick = () =>{
        if(this.props.blocked)
            return;
        this.props.onChange('profile')
    }

    handleGameClick = () =>{
        if(this.props.blocked)
            return;
        this.props.onChange('game')
    }

    handleHistoryClick = () =>{
        if(this.props.blocked)
            return;
        this.props.onChange('history')
    }

    handleRulesClick = () =>{
        if(this.props.blocked)
            return;
        this.props.onChange('rules')
    }
    render(){
        return (
            <div className="menu">
                <ColorMenu token={this.props.User.token}/>
                <nav id="menuContainer">
                    {
                        this.props.selector !== 'profile' &&
                        <div className="menuButton" onClick={this.handleProfileClick}>
                            <img src={this.props.User.imgUrl}  alt="profileImg" id="iconProfile"/>
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
                        this.props.forceHistory &&
                        <div className="menuButton" onClick={this.handleHistoryClick}>
                            <FontAwesomeIcon className="icon" icon={solid('table-list')}/>
                            <h2> HISTORY</h2>
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
