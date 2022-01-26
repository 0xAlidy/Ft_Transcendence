import * as React from "react";
import { user } from "../MainPage";
import ProfileShortCut from "../ProfileShortcut";
import { Msg } from './Chat';
import "../../../styles/MainPage/Chat/Chat.css"

export default class MessageItem extends React.Component <{msg:Msg, User:user,activeRoom:string}, {activeRoom:string}>
{
	constructor(props:any) {
		super(props)
        this.state = {
            activeRoom: this.props.activeRoom,
        }
	};

    putText = () => {
        if(this.state.activeRoom === this.props.msg.dest){

			var chatBox = document.getElementById("chatmessage")
			var newDiv = document.createElement("div");
			var time = document.createElement("p");
			time.textContent = this.props.msg.date;
			if (this.props.User.name === this.props.msg.sender){
				newDiv.className = 'myMsg';
				newDiv.appendChild(document.createTextNode(this.props.msg.message));
				newDiv.append(time);
			}
			else if (this.props.msg.sender === "system"){
				newDiv.className = 'systemMsg';
				newDiv.appendChild(document.createTextNode(this.props.msg.message));
			}
			else{
				newDiv.className = 'otherMsg';
				newDiv.appendChild(document.createTextNode(this.props.msg.sender + ": " + this.props.msg.message));
				newDiv.append(time);
			}
			if (chatBox)
				chatBox.appendChild(newDiv)
        }
    }


	render(){
		return (
            <div className="msgItem">
                {this.props.msg.message}
                <p>hello</p>
                <div style={{width:"1px", borderRadius:"50%"}}>
                    <ProfileShortCut pseudo={this.props.User.name} token={this.props.User.token} canOpen={true}/>
                </div>

            </div>
		)
	}
}