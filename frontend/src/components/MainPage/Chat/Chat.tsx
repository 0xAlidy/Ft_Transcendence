import * as React from "react";
import "../../../styles/MainPage/Chat/Chat.css"
import {Room} from './class';
import Send from '../../../assets/send.png'
import { Socket } from "socket.io-client";
import ChatMenu from "./chatMenu";

const myCSSCont = " word-wrap: break-all; background-color : #edca00; padding : 15px; align-self: end; border-radius : 23px 23px 0px 23px; margin-bottom : 15px; float : right; clear: both; ";
const otherCSSCont = "word-wrap: break-all; width:fit-content; background-color : #636363; padding : 15px; align-self: begin;border-radius : 23px 23px 23px 0px;margin-bottom : 15px;clear: both";



class Message{
	message: string;
	dest: string;
	sender: string;
	constructor(Cont:string , dest:string, sender: string){
		this.message = Cont;
		this.sender = sender;
		this.dest = dest;
	}
	resetCont(){
		this.message = "";
		this.sender = "";
		this.dest = "";
	}
}


export default class Chat extends React.Component <{socket:Socket, username:string}, {activeRoom:string | null, msgInput:string, rooms:Room[], loaded:boolean}>{
	roomList:Room[] = [];
	ReceiveCont = (newCont:Message) =>{
		console.log(this.state.activeRoom );
		console.log(newCont.dest);
		if(this.state.activeRoom === newCont.dest){
			var chatBox = document.getElementById("chatmessage")
			var newDiv = document.createElement("div");
			if (this.props.username === newCont.sender)
			newDiv.setAttribute('style',myCSSCont);
			else
			newDiv.setAttribute('style',otherCSSCont);
			newDiv.appendChild(document.createTextNode(newCont.message));
			if (chatBox)
			chatBox.appendChild(newDiv)
		}
	};

	constructor(props:any) {
		super(props);
		this.roomList = [];
		this.state = {
			activeRoom: null,
			msgInput: '',
			rooms: [],
			loaded:false,

		};
		this.props.socket.emit('getRoomList')
		this.props.socket.on('chatToClient',  (data:any) => {
			console.log("hello");
            console.log(data.Message);
			this.ReceiveCont(data);
        });
		this.props.socket.on('sendRoomList', (data:any) => {
			console.log("update roomList")
			this.setState({rooms:data.rooms, loaded:true});
			
		});
	}

	// componentDidMount = () => {
	// 	this.props.socket.emit('getRoomList')
	// }

	sendMessage = () => {
		var input = (document.getElementById('inputText') as HTMLInputElement).value;
		if (this.state.activeRoom) {
			var ne = new Message(input, this.state.activeRoom, this.props.username); 
			this.props.socket.emit('chatToServer', ne);
		}
	}
	
	sendNewRoom = (name:any) => {
		this.props.socket.emit('newRoom', {name:name, id:0,creator:this.props.username,password:""});
		console.log("new room " + name + " has been sent");
	};
	
	render(){
		
		return (
			<div className="chatContainer" id="chatContainer">

				<div className="chattext">
					<input onChange={(msg:any) => console.log(msg)} placeholder="     Text message" id='inputText' className="inputChat" />
				</div>

				<div className="chatsend">
					<img src={Send} alt="" className="send" defaultValue='NULL' width='25px' height='25px' onClick={this.sendMessage} />
				</div>

				<div className="back"></div>
				{this.state.loaded === true && <ChatMenu newRoom={this.sendNewRoom} roomList={this.state.rooms} />}
				<div id="chatmessage" className="chatmessage"/>
				</div>
		)
	}
}

				 {/* <div className="chatinfo" id ="chatinfo" onMouseEnter={this.hoverEvent} onMouseLeave={this.hoverLeaveEvent}> 
					<div className="topbar">
						<img src={MenuPng} alt="maqueue" className="iconMenu" width='22px' height='22px' />
						<div className="tittle">Chat</div>
				
					</div>
					<li className="statusRoom" id="statusRoom">logged to : {this.state.activeRoom}</li>
					<div className="divFormMenu">
						<input type="text" id="usernameInput" autoComplete="off" placeholder="pseudo" className="menuInput"/>
	   					<button className="pseudoButton" onClick={this.sendUsername}>send</button>
	   				</div>
					<MySelect socket={this.props.socket}/>
					<div className="divFormMenu">
						<input type="text" id="newRoomInput" autoComplete="off" placeholder="New Room" className="menuInput"/>
	   					<button className="pseudoButton" onClick={this.sendNewRoom}>Add</button>
	   				</div>
				</div> */}
				