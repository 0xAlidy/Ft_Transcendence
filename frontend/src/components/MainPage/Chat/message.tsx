import * as React from "react";
import { User } from "../../../interfaces";
import ProfileShortCut from "../ProfileShortcut";
import { Msg } from './Chat';
import "../../../styles/MainPage/Chat/Chat.css"
import { Socket } from "socket.io-client";

export default class MessageItem extends React.Component <{msg:Msg, User:User,activeRoom:string,class:string, socket:Socket}, {activeRoom:string, classItem:string}>
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
			// var date = this.props.msg.date.toTimeString().slice(0, 5)
			
			return (
            <div className={this.state.classItem}>
				<div className="bubble">
                	{this.props.msg.message}
					{this.system === false && <p>{this.props.msg.date}</p>}
				</div>
                { this.system === false && <div className="imgBlock">
                   <ProfileShortCut login={this.props.msg.sender} User={this.props.User} socket={this.props.socket}/>
                </div>
				}
            </div>
		)
	}
}
