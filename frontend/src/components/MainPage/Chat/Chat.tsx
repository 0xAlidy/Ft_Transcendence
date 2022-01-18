import * as React from "react";
import "../../../styles/MainPage/Chat/Chat.css"
import {Room} from './class';
import Send from '../../../assets/send.png'
import MenuPng from '../../../assets/menu.png'
import { Socket } from "socket.io-client";
import Select from 'react-select';

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

var username:string = "";
var activeRoom:string = "none";
var roomList:Room[] = [];

class MySelect extends React.Component<{socket:Socket}, any> {
	state = {
		selectedOption: null,
	}		
	general: Room = {name:"general", id:0, password:"", userList:[]};
	general2: Room = {name:"general2", id:1, password:"123", userList:["toto"]};
	options = [{value:"",label:""}]
	convert = () => {
		for (var i = 0; i < roomList.length; i++){
			this.options.push({value:roomList[i].name, label:roomList[i].name})
		}
	}
	joinRoom = () => {
		var selectValue = (document.getElementById('selectRoom') as HTMLSelectElement).value;
		console.log(selectValue);
	}
	handleChange = (selectedOption:any) => {
		this.setState({ selectedOption });
		console.log(selectedOption)
		activeRoom = selectedOption;
	}
	constructor(props:any) {
		super(props)
		// roomList.push(this.general);
		// roomList.push(this.general2);
		this.props.socket.on('sendRoomlist',  (data:any) => {
			this.convert();
			console.log(data.rooms)
		});
	};
	render() {
	  return(
		  <div>
			<button  type="button" onClick={this.convert} >lock </button>
			<Select className="SelectRoom" 
					options={this.options}
					defaultInputValue="general"
					id="selectRoom"
					onChange={this.handleChange}
					placeholder="join a room"
			/>
		  </div>
	  )
	}
}

export default class Chat extends React.Component <{socket:Socket}, any>{
	ReceiveCont = (newCont:Message) =>{
		console.log(activeRoom );
		console.log(newCont.dest);
		if(activeRoom === newCont.dest){
			var chatBox = document.getElementById("chatmessage")
			var newDiv = document.createElement("div");
			if (username === newCont.sender)
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
	
		this.state = {
			activeRoom: "none",
		};
		this.props.socket.on('chatToClient',  (data:any) => {
			console.log("hello");
            console.log(data.Message);
			this.ReceiveCont(data);
        });
		this.props.socket.on('sendRoomList', (data:any) => {
			console.log("update roomList")
			roomList = data.rooms;
			// this.UpdateSelect();
		});
	}

	sendMessage = () => {
		var input = (document.getElementById('inputText') as HTMLInputElement).value;
		var ne = new Message(input, activeRoom, username); 
		this.props.socket.emit('chatToServer', ne);
	}
	sendUsername = () => {
		var user = document.getElementById("usernameInput") as HTMLInputElement;
		if (user){
			username = user.value;
			console.log("you now logged as => " + username);
		}
	};
	hoverEvent = () => {
		var chatMenu = document.getElementById("chatContainer") as HTMLDivElement;
		chatMenu.setAttribute('style', "grid-template-rows: 90% auto 40px;");
	};
	hoverLeaveEvent = () => {
		var chatMenu = document.getElementById("chatContainer") as HTMLDivElement;
		chatMenu.setAttribute('style', "grid-template-rows: 4% auto 40px;");
	};
	
	sendNewRoom = () => {
		var newName = document.getElementById("newRoomInput") as HTMLInputElement;
		this.props.socket.emit('newRoom', {name:newName.value, id:0,creator:username,password:""});
		console.log("new room " + newName.value + " has been sent");
	};
	
	render(){
		return (
			<div className="chatContainer" id="chatContainer">

				<div className="chattext">
					<input placeholder="     Text message" id='inputText' className="inputChat" />
				</div>

				<div className="chatsend">
					<img src={Send} alt="" className="send" defaultValue='NULL' width='25px' height='25px' onClick={this.sendMessage}/>
				</div>

				<div className="back"></div>

				 <div className="chatinfo" id ="chatinfo" onMouseEnter={this.hoverEvent} onMouseLeave={this.hoverLeaveEvent}> 
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
				</div>
				<div id ="chatmessage" className="chatmessage">
				</div> 
			</div>
		)
	}
}
