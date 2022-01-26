import * as React from "react";
import "../../../styles/MainPage/Chat/Chat.scss"
import {Room} from './class';
import Send from '../../../assets/send.png'
import { Socket } from "socket.io-client";
import ChatMenu from "./chatMenu";
import Picker from 'emoji-picker-react';

class Message{
	message: string;
	dest: string;
	sender: string;
	date: string;
	constructor(Cont:string , dest:string, sender: string, date:string){
		this.message = Cont;
		this.sender = sender;
		this.dest = dest;
		this.date = date;
	}
	resetCont(){
		this.message = "";
		this.sender = "";
		this.dest = "";
		this.date = "";
	}
}


/*

- date


- block = don t see message									//	/block "pseudo"
- unblock = see again										//	/unblock "pseudo"
- admin cmd =	- change pass define it or remove it 		//	/pass "new"     /pass rm
- set admin													//	/admin "pseudo"
- ban 														//	/ban "pseudo"  
- unban 													//	/unban "pseudo"
- mute 														//	/mute "pseudo" time(minutes)



- help = montre les cmd possible 							//  /help	
- message tu n es pas admin vas te faire encule tu t es tromper encule tu t es tromper tu n es bon qu a boycoter encule tu t es tromper 

*/

// const minute = 1000 * 60;
// const hour = minute * 60;
// const day = hour * 24;
// const year = day * 365;


export default class Chat extends React.Component <{socket:Socket, username:string}, {activeRoom:string, msgInput:string, rooms:Room[], loaded:boolean, date:string, loadEmoji:boolean,chosenEmoji:any,chatInput:any}>{
	roomList:Room[] = [];
	ReceiveCont = (newCont:Message) =>{
		if(this.state.activeRoom === newCont.dest){
			var chatBox = document.getElementById("chatmessage")
			var newDiv = document.createElement("div");
			var time = document.createElement("p");
			time.textContent = newCont.date;
			// time.appendChild(document.createTextNode(newCont.date))
			if (this.props.username === newCont.sender){
				newDiv.className = 'myMsg';
				newDiv.appendChild(document.createTextNode(newCont.message));
				newDiv.append(time);
			}
			else if (newCont.sender === "system"){
				newDiv.className = 'systemMsg';
				newDiv.appendChild(document.createTextNode(newCont.message));
			}
			else{
				newDiv.className = 'otherMsg';
				newDiv.appendChild(document.createTextNode(newCont.sender + ": " + newCont.message));
				newDiv.append(time);
			}
			if (chatBox)
				chatBox.appendChild(newDiv)
		}
	};

	constructor(props:any) {
		super(props);
		this.roomList = [];
		this.state = {
			chatInput:"",
			loadEmoji:false,
			chosenEmoji: null,
			date: "",
			activeRoom: '',
			msgInput: '',
			rooms: [],
			loaded:false,

		};
		this.props.socket.emit('getRoomList')
		this.props.socket.on('chatToClient',  (data:any) => {
			this.ReceiveCont(data);
        });
		this.props.socket.on('sendRoomList', (data:any) => {
			console.log("update roomList")
			this.setState({rooms:data.rooms, loaded:true});
			
		});
	}

	sendMessage = () => {
		 var input = (document.getElementById('inputText') as HTMLInputElement).value;
		var date = new Date().toTimeString().slice(0,5)
		if (this.state.activeRoom) {
			var ne = new Message(input, this.state.activeRoom, this.props.username, date); 
			this.props.socket.emit('chatToServer', ne);
		}
	}
	
	sendNewRoom = (name:any) => {
		this.props.socket.emit('newRoom', {name:name, id:0,creator:this.props.username,password:""});
		console.log("new room " + name + " has been sent");
	};
	
	updateRoom = (newOne:any) => {
		this.setState({activeRoom:newOne})
	}

	onEmojiClick = (emojiObject:any) => {
		
		this.setState({chatInput: this.state.chatInput + emojiObject.emoji})
	}

	displayEmoji = () => {
		if (this.state.loadEmoji === true)
			this.setState({loadEmoji:false})
		if (this.state.loadEmoji === false)
			this.setState({loadEmoji:true})
	}

	render(){
		
		return (
			<div className="chatContainer" id="chatContainer">

				{this.state.loadEmoji === true && <Picker pickerStyle={{width: "300px", position: "relative"}} onEmojiClick={this.onEmojiClick}/>}
				<div className="chattext">
					<input onChange={(e:any) => this.setState({chatInput: this.state.chatInput + e.target.value})} type="text" placeholder="     Text message" id='inputText' className="inputChat" />
					{/* <input onChange={(msg:any) => console.log(msg)} placeholder="     Text message" id='inputText' className="inputChat" /> */}

				</div>

					<button className="chatEmoji" onClick={this.displayEmoji}>Emo</button> 
				<div className="chatsend">
					<img src={Send} alt="" className="send" defaultValue='NULL' width='25px' height='25px' onClick={this.sendMessage} />
				</div>
				<div className="back"></div>
				{this.state.loaded === true && <ChatMenu newRoom={this.sendNewRoom}  actRoom={this.updateRoom} roomList={this.state.rooms} />}
				<div id="chatmessage" className="chatmessage"/>
				</div>
		)
	}
}
				