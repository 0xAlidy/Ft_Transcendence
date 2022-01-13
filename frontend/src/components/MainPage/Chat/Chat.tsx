
//todo
//	=>titre utiliser state pour le mettre a jour avec selected opt ?????
//	=>bouton send
//	=>active room message 
//	=> css chat info hover 




import * as React from "react";
// import { useState } from 'react';
import "../../../styles/MainPage/Chat/Chat.css"
import room from './class';
import Send from '../../../assets/send.png'
import MenuPng from '../../../assets/menu.png'
// import { socket } from "../MainPage";
import { Socket } from "socket.io-client";
import Select from 'react-select';



const myCSSCont = " background-color : #edca00; padding : 15px; align-self: end; border-radius : 23px 23px 0px 23px; margin-bottom : 15px; float : right; clear: both; ";
const otherCSSCont = " background-color : #636363; padding : 15px; align-self: end;borderRadius : 23px 23px 23px 0px;marginBottom : 15px;clear: both";


class Message{
	message: string;
	// Time: number;
	dest: string;
	sender: string;
	constructor(Cont:string , dest:string, sender: string){
		this.message = Cont;
		this.sender = sender;
		this.dest = dest;
		// this.Time = Date.now();
	}
	resetCont(){
		this.message = "";
		this.sender = "";
		this.dest = "";
	}
}

var roomList:room[] = [];
var username:string = "";
var activeRoom:string = "general";
// const [activeRoom, setActiveRoom] = useState("general");

class MySelect extends React.Component<{socket:Socket}, any> {
	state = {
		selectedOption: null,
	}
	general: room = {name:"general", password:"", userList:[]};
    general2: room = {name:"general2", password:"123", userList:["toto"]};
    options = [{value:"",label:""}]
    refresh = (newRoom:room[]) =>{
        var newRoomList:room[] = [];
        for (var i = 0; i < newRoom.length; i++){
            newRoomList.push(newRoom[i])
        }
        roomList = newRoomList;
    }
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
		// setActiveRoom(selectedOption);
		activeRoom = selectedOption;
	}
    constructor(props:any) {
        super(props)
        roomList.push(this.general);
        roomList.push(this.general2);
        this.props.socket.on('sendRoomlist', function (data:any) {
            roomList = data.rooms;
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
			{/* <button type="button" onClick={this.joinRoom}>join</button> */}
          </div>
      )
    }

}

export default class Chat extends React.Component <{socket:Socket}, any>{

	state = {
		tittleRoom: activeRoom,
	};

	
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
		this.props.socket.on('chatToClient',  (data:any) => {
			console.log("hello");
            console.log(data.Message);
           	this.ReceiveCont(data);
        });
	}

	getRoomList = () => {
		console.log("update roomList")
		this.props.socket.emit("getRoomList");
	};
	sendMessage = () => {
		var input = (document.getElementById('inputText') as HTMLInputElement).value;
		var ne = new Message(input, activeRoom, username); //a envoyer a la database, le back dispatchera les messages aux user concerne. le back enverra un Cont socket pour refresh les Cont affiche
		this.props.socket.emit('chatToServer', ne);//{sender:username, dest:activeRoom, message:input}
		//console.log(ne);
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
			chatMenu.setAttribute('style', "grid-template-rows: 25% auto 40px;");
	};
	hoverLeaveEvent = () => {
		var chatMenu = document.getElementById("chatContainer") as HTMLDivElement;
		chatMenu.setAttribute('style', "grid-template-rows: 4% auto 40px;");
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

				 <div className="chatinfo" id ="chatinfo" onMouseEnter={this.hoverEvent} onMouseLeave={this.hoverEvent}> 
					<div className="topbar">
						<img src={MenuPng} alt="maqueue" className="iconMenu" width='22px' height='22px' />
						<div className="tittle">{activeRoom}</div>
					</div>
					<MySelect socket={this.props.socket}/>

					<form>
     			   		<input type="text" id="usernameInput" placeholder="pseudo" className="menuInput"/>
						<input type="submit" value="send" id="ok"/>
					</form>

					{/* <div className="hiddenMenu"> */}

					{/* </div> */}






				</div>
				<div id ="chatmessage" className="chatmessage">
				</div> 
			</div>
		)
	}
}
