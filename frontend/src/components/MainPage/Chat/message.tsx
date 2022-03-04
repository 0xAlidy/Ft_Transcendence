import * as React from "react";
import { User } from "../../../interfaces";
import ProfileShortCut from "../ProfileShortcut";
import { Msg } from './Chat';
import "../../../styles/MainPage/Chat/Chat.css"
import { Socket } from "socket.io-client";

export default class MessageItem extends React.Component <{msg:Msg, User:User,activeRoom:string,class:boolean, socket:Socket}, {activeRoom:string, classItem:string}>
{
	system:boolean =false;
	constructor(props:any) {
		super(props)
        this.state = {
            activeRoom: this.props.activeRoom,
			classItem:"",
		}
	}
		render(){
			// var date = this.props.msg.date.toTimeString().slice(0, 5)
			var date = new Date(this.props.msg.date).toLocaleTimeString().slice(0,5);
			var key = new Date(this.props.msg.date).getMilliseconds().toString();
			return (<>
			{
			this.props.class ? <div className={'msgItem'}>
			<div className="bubble">
				{this.props.msg.message}
			<p>{date}</p>
			</div>
				{ this.system === false && <div className="imgBlock">
					<ProfileShortCut key={key} login={this.props.msg.sender} User={this.props.User} socket={this.props.socket}/>
				</div>
				}
			</div> :
            <div className={'msgOtherItem'}>
				<div className="bubble">
                	{this.props.msg.message}
				<p>{date}</p>
				</div>
                { this.system === false && <div className="imgBlock">
                   <ProfileShortCut key={key} login={this.props.msg.sender} User={this.props.User} socket={this.props.socket}/>
                </div>
				}
            </div>
		}
		</>)
	}
}
