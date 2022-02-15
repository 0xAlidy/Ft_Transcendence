import * as React from "react";
import { user } from "../MainPage";
import ProfileShortCut from "../ProfileShortcut";
import { Msg } from './Chat';
import "../../../styles/MainPage/Chat/Chat.css"

export default class MessageItem extends React.Component <{msg:Msg, User:user,activeRoom:string,class:string}, {activeRoom:string, classItem:string}>
{
	system:boolean =false;
	constructor(props:any) {
		super(props)
        this.state = {
            activeRoom: this.props.activeRoom,
			classItem:this.props.class,
        }
		if (this.props.msg.sender === "system")
			this.system = true;
	};

	render(){
		return (
            <div className={this.state.classItem}>
				<div className="bubble">
                	{this.props.msg.message}
					{ this.system === false && <p>{this.props.msg.date}</p>}
				</div>
                { this.system === false && <div className="imgBlock">
                   <ProfileShortCut pseudo={this.props.msg.sender} token={this.props.User.token} canOpen={true}/>
                </div>
				}
            </div>
		)
	}
}
