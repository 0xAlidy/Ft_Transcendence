/*

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


import * as React from "react";
import "../../../styles/MainPage/Chat/Chat.css"
import {Room} from './class';
import Send from '../../../assets/send.png'
import { Socket } from "socket.io-client";
import ChatMenu from "./chatMenu";
// import Picker from 'emoji-picker-react';
import {user} from '../MainPage'
import MessageItem from "./message";

export class Message{
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

export interface Msg{
	id: number;
	sender: string;
	dest:string;
	message:string;
	date:string;
}
export interface opt{
	value:string;
	label:string;
}

export default class Chat extends React.Component <{socket:Socket, User:user}, {RowsStyle:string;activeRoom:string, msgInput:string, rooms:opt[], loaded:boolean, date:string, loadEmoji:boolean,chosenEmoji:any,chatInput:any, messages:Msg[]}>{
	roomList:Room[] = [];
	mRef:HTMLDivElement | null;
	inputRef:HTMLInputElement | null;

	constructor(props:any) {
		super(props);
		this.mRef = null;
		this.inputRef = null;
		this.roomList = [];
		this.state = {
			messages: [],
			chatInput:"",
			loadEmoji:false,
			chosenEmoji: null,
			date: "",
			activeRoom: 'general',
			msgInput: '',
			rooms: [],
			RowsStyle: '40px auto 40px',
			loaded:false,

		};
		this.props.socket.emit('getRoomList')
		this.props.socket.on('LoadRoom',  (data:any) => {
			this.setState({messages: data.msg, activeRoom: data.room})
        });
		this.props.socket.on('ReceiveMessage',  (data:any) => {
			this.setState({messages: this.state.messages.concat([data])})
			if (this.mRef)
				this.mRef.scrollTop = this.mRef.scrollHeight;
        });
		this.props.socket.on('updateRooms', (data:any) => {
			console.log(data.array)
			var arr:opt[] = [];
			data.rooms.forEach((element:string) => {
				arr.push({value:element,label:element})
			});
			this.setState({rooms:arr, loaded:true});
		});
		this.props.socket.on('moveToChannel', (data:any) => {

		})
	}

	messagesRef = (ref:HTMLDivElement) => {
		this.mRef = ref;
	}
	menuOpen = (str:string) => {
		this.setState({RowsStyle:str})
	}

	setInputRef = (input:HTMLInputElement) => {
		this.inputRef = input;
	}

	sendMessage = () => {
		var date = new Date().toTimeString().slice(0,5)

		if (this.inputRef)
			if (this.state.activeRoom && this.inputRef.value !== "") {
				var toSend = {sender:this.props.User.name, dest:this.state.activeRoom, message:this.inputRef.value, date:date};
				this.props.socket.emit('sendMessage', toSend);
				this.inputRef.value = "";
			}
		//this.setState({chatInput:""});
	}

	sendNewRoom = (name:any) => {
		this.props.socket.emit('newRoom', {name:name, id:0,creator:this.props.User.name,password:""});
		console.log("new room " + name + " has been sent");
	}

	updateRoom = (newOne:string) => {
		this.props.socket.emit('getMessage', {room:newOne})
		this.setState({activeRoom:newOne})
		if (this.mRef)
			this.mRef.innerHTML = "";
		// var date = new Date().toTimeString().slice(0,5)
		// var ne = new Message("you are now logged to : " + newOne, this.state.activeRoom, "system", date);
		// this.setState({messages: this.state.messages.concat([ne])})
		// this.ReceiveCont(ne);
	}


	inputEnter = (event:any) => {
		if(event.code === 'Enter')
			this.sendMessage();
	}

	changeRoom = (room:string) =>{
		this.props.socket.emit('askAuthorisation',{ room:room, token:this.props.User})
	}

	// onEmojiClick = (emojiObject:any) => {

	// 	this.setState({chatInput: this.state.chatInput + emojiObject.emoji})
	// }

	// displayEmoji = () => {
	// 	if (this.state.loadEmoji === true)
	// 		this.setState({loadEmoji:false})
	// 	if (this.state.loadEmoji === false)
	// 		this.setState({loadEmoji:true})
	// }

	render(){

		return (
			<div className="chatContainer" id="chatContainer" style={{gridTemplateRows:this.state.RowsStyle}}>

				{/* {this.state.loadEmoji === true && <Picker pickerStyle={{width: "300px", position: "relative"}} onEmojiClick={this.onEmojiClick}/>} */}
				<div className="chattext">
					<input onKeyPress={this.inputEnter} onChange={(e:any) => this.setState({chatInput: this.state.chatInput + e.target.value})} ref={this.setInputRef} type="text" placeholder="     Text message" autoComplete="off" id='inputText' className="inputChat" />
					{/* <input onChange={(msg:any) => console.log(msg)} placeholder="     Text message" id='inputText' className="inputChat" /> */}

				</div>

					{/* <button className="chatEmoji" onClick={this.displayEmoji}>Emo</button>  */}
				<div className="chatsend">
					<img src={Send} alt="" className="send" defaultValue='NULL' width='25px' height='25px' onClick={this.sendMessage} />
				</div>
				<div className="back"></div>
				<ChatMenu onRoomChange={this.changeRoom} newRoom={this.sendNewRoom}  actRoom={this.state.activeRoom} socket={this.props.socket} roomList={this.state.rooms} onMenuOpen={this.menuOpen}/>
				<div id="chatmessage" ref={this.messagesRef} className="chatmessage">
					{
						this.state.messages.map(( (item, idx) => {
							if (item.sender === this.props.User.name)
								var classForItem = "msgItem"
							else
								var classForItem = "msgOtherItem"
							return (
								<MessageItem msg={item} User={this.props.User} activeRoom={this.state.activeRoom} class={classForItem}/>
							)
						}))
					}
				</div>
				</div>
		)
	}
}











// ReceiveCont = (newCont:Message) =>{
	// 	// const myProfile = <ProfileShortCut pseudo={this.props.User.name} token={this.props.User.token} canOpen={false}/>;
	// 	if(this.state.activeRoom === newCont.dest){

	// 		var chatBox = document.getElementById("chatmessage")
	// 		var newDiv = document.createElement("div");
	// 		var time = document.createElement("p");
	// 		time.textContent = newCont.date;
	// 		// time.appendChild(document.createTextNode(newCont.date))
	// 		if (this.props.User.name === newCont.sender){
	// 			newDiv.className = 'myMsg';
	// 			// newDiv.appendComponent(myProfile)
	// 			// newDiv.appendChild(<ProfileShortCut pseudo={this.props.User.name} token={this.props.User.token} canOpen={false}/>)
	// 			newDiv.appendChild(document.createTextNode(newCont.message));
	// 			newDiv.append(time);
	// 		}
	// 		else if (newCont.sender === "system"){
	// 			newDiv.className = 'systemMsg';
	// 			newDiv.appendChild(document.createTextNode(newCont.message));
	// 		}
	// 		else{
	// 			newDiv.className = 'otherMsg';
	// 			// newDiv.append(<ProfileShortCut pseudo={newCont.sender} token={this.props.User.token} canOpen={false}/>)
	// 			newDiv.appendChild(document.createTextNode(newCont.sender + ": " + newCont.message));
	// 			newDiv.append(time);
	// 		}
	// 		if (chatBox)
	// 			chatBox.appendChild(newDiv)
	// 	}
	// };
