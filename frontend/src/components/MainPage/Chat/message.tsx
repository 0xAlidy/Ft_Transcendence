import * as React from "react";
import { user } from "../MainPage";
import ProfileShortCut from "../ProfileShortcut";
import { Msg } from './Chat';
import "../../../styles/MainPage/Chat/Chat.css"

export default class MessageItem extends React.Component <{msg:Msg, User:user,activeRoom:string,class:string}, {activeRoom:string, classItem:string}>
{
	constructor(props:any) {
		super(props)
        this.state = {
            activeRoom: this.props.activeRoom,
			classItem:this.props.class,
        }
	};

	render(){
		return (
            <div className={this.state.classItem}>
				<div className="bubble">
                	{this.props.msg.message}
					<p>{this.props.msg.date}</p>
				</div>
                <div className="imgBlock">
                    <ProfileShortCut pseudo={this.props.msg.sender} token={this.props.User.token} canOpen={true}/>
                </div>
            </div>
		)
	}
}







// var chatBox = document.getElementById("chatmessage")
// 			var newDiv = document.createElement("div");
// 			var time = document.createElement("p");
// 			time.textContent = this.props.msg.date;
// 			if (this.props.User.name === this.props.msg.sender){
// 				newDiv.className = 'myMsg';
// 				newDiv.appendChild(document.createTextNode(this.props.msg.message));
// 				newDiv.append(time);
// 			}
// 			else if (this.props.msg.sender === "system"){
// 				newDiv.className = 'systemMsg';
// 				newDiv.appendChild(document.createTextNode(this.props.msg.message));
// 			}
// 			else{
// 				newDiv.className = 'otherMsg';
// 				newDiv.appendChild(document.createTextNode(this.props.msg.sender + ": " + this.props.msg.message));
// 				newDiv.append(time);
// 			}
// 			if (chatBox)
// 				chatBox.appendChild(newDiv)