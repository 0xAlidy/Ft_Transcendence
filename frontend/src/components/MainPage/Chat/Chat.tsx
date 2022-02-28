/*

- block = don t see message									//	/block "pseudo"
- unblock = see again										//	/unblock "pseudo"
- admin cmd =	- change pass define it or remove it 		//	/pass "new"     /pass rm
- set admin													//	/admin "pseudo"
- ban 														//	/ban "pseudo"
- unban 													//	/unban "pseudo"
- mute 														//	/mute "pseudo" time(minutes)
- private room



- help = montre les cmd possible 							//  /help
- message tu n es pas admin vas te faire encule tu t es tromper encule tu t es tromper tu n es bon qu a boycoter encule tu t es tromper

*/


import * as React from "react";
import "../../../styles/MainPage/Chat/Chat.css"
import Send from '../../../assets/send.png'
import { Socket } from "socket.io-client";
import ChatMenu from "./chatMenu";
import { User } from '../../../interfaces'
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

const Popup = (props:any) => {
    return (
      <div className="popup-box">
        <div className="box">
          {props.content}
        </div>
      </div>
    );
  };

export default class Chat extends React.Component <{socket:Socket, User:User}, {openNewPass:boolean,openNewRoom:boolean,RowsStyle:string;activeRoom:string, msgInput:string, rooms:any, loaded:boolean, date:string, loadEmoji:boolean,chosenEmoji:any,chatInput:any, messages:Msg[]}>{
	// roomList:Room[] = [];
	mRef:HTMLDivElement | null;
	inputRef:HTMLInputElement | null;

	needPass:string = "";

	constructor(props:any) {
		super(props);
		this.mRef = null;
		this.inputRef = null;
		// this.roomList = [];
		this.state = {
			openNewPass:false,
			openNewRoom:false,
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
		this.props.socket.on('banned', () => {
			var date = new Date().toTimeString().slice(0,5)
			var banMsg:Msg = { id: 0, sender:"system", dest:this.state.activeRoom, message:"you have been kicked", date:date}
			this.setState({messages: this.state.messages.concat([banMsg])})
			if (this.mRef)
				this.mRef.scrollTop = this.mRef.scrollHeight;
		})
		this.props.socket.on('LoadRoomPass',  (data:any) => {
			this.togglePopupPass()
			this.setState({messages: data.msg, activeRoom: data.room})
        });
		this.props.socket.on('ReceiveMessage',  (data:any) => {
			console.log(data);
			this.setState({messages: this.state.messages.concat([data])})
			if (this.mRef)
				this.mRef.scrollTop = this.mRef.scrollHeight;
        });
		this.props.socket.on('updateRooms', (data:any) => {
			var arr:opt[] = [];
			data.rooms.forEach((element:string) => {
				arr.push({value:element,label:element})
			});
			var ret = this.parseRoom(arr)
			this.setState({rooms:ret, loaded:true});
		});
		this.props.socket.on('needPassword', (data:any) => {
			this.needPass = data.room;
			this.setState({messages: []})
			this.setState({RowsStyle:"40px auto 40px"})
			this.setState({openNewPass:true})
		})

	}

	parseRoom(arr:opt[]){
		var room:opt[] = [];
		var priv:opt[] = [];
		var grouped = [];
		arr.forEach((element:opt) => {
			console.log(element)
			if (element.label[0] == '-'){
				var name = element.label.slice(1, element.label.indexOf('/') -1 );
				var label = element.label.split('/').at(1)
				if (label)
					element.label = label;
				console.log("name " + name)
				if (name == this.props.User.login)
					priv.push(element)
			}
			else
				room.push(element)
		});
		grouped = [{label: "Room", options:room}, {label:"priv", options:priv}];
		console.log(grouped);
		return grouped;
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
					var toSend = {sender:this.props.User.login, dest:this.state.activeRoom, message:this.inputRef.value, date:date};
					this.props.socket.emit('sendMessage', toSend);
					this.inputRef.value = "";
			}
	}

	sendNewRoom = () => {
		var name = (document.getElementById("nameNewRoom") as HTMLInputElement).value;
        var pass = (document.getElementById("passNewRoom") as HTMLInputElement).value;
        if (pass !== "")
		{
			this.props.socket.emit('newRoom', {name:name, id:0,creator:this.props.User.login,password:pass})
		}
		else{
			this.props.socket.emit('newRoom', {name:name, id:0,creator:this.props.User.login,password:null})
		}
        this.togglePopupRoom();
	}

	updateRoom = (newOne:string) => {
		this.props.socket.emit('getMessage', {room:newOne})
		this.setState({activeRoom:newOne})
		if (this.mRef)
			this.mRef.innerHTML = "";
	}


	inputEnter = (event:any) => {
		if(event.code === 'Enter')
			this.sendMessage();
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


	handlePopUpRoom = () => {
		this.setState({messages: []})
        this.setState({openNewRoom:true})
    };

	togglePopupRoom = () => {
        this.setState({openNewRoom:false});
		this.props.socket.emit('joinRoom', {room:this.state.activeRoom})
    };

	sendPass = () => {
		var pass = document.getElementById("passRequest") as HTMLInputElement;
		this.props.socket.emit('password', {pass:pass.value, room:this.needPass})
	}

	togglePopupPass = () => {
		this.setState({openNewPass:false});
	}

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
				<ChatMenu newRoom={this.handlePopUpRoom}  actRoom={this.state.activeRoom} socket={this.props.socket} roomList={this.state.rooms} onMenuOpen={this.menuOpen}/>
				<div id="chatmessage" ref={this.messagesRef} className="chatmessage">
					{this.state.openNewRoom === true && <Popup
                    content={<>
                        <b>Create a New Room :</b>
                        <input type="text" placeholder="name" id="nameNewRoom" className="inputPopUp"/>
                        <input type="password" placeholder="password (optionnal)" id="passNewRoom" className="inputPopUp"/>
                        <button onClick={this.sendNewRoom} className="buttonPopUp1">Send</button>
                        <button onClick={this.togglePopupRoom} className="buttonPopUp">Cancel</button>
                      </>}
                	/>}

					{this.state.openNewPass === true && <Popup
						content={<>
							<b>This room require a password :</b>
                        	<input type="password" placeholder="password" id="passRequest" className="inputPopUp"/>
                        	<button onClick={this.sendPass} className="buttonPopUp1">Send</button>
                        	<button onClick={this.togglePopupPass} className="buttonPopUp">Cancel</button>
						</>}
					/>}

					{
						this.state.messages.map(( (item) => {
							var classForItem;
							if (item.sender === this.props.User.login)
								classForItem = "msgItem"
							else if (item.sender === "system")
								classForItem = "systemMsg"
							else
								classForItem = "msgOtherItem"
							return (
								<MessageItem msg={item} User={this.props.User} activeRoom={this.state.activeRoom} socket={this.props.socket} class={classForItem}/>
							)
						}))
					}
				</div>
				</div>
		)
	}
}
