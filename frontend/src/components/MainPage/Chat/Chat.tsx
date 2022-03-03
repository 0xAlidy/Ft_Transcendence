/*

-message bizare todo{}
-message systeme

-priv room name nickname


a tester
-modifier mdp ou retirer
-block refuser les privs conv












done

//	/unban "pseudo"
- pas afficher les message des gens bloquer
- admin cmd =	- change pass define it or remove it 		//	/pass "new"     /pass rm
done - set admin													//	/admin "pseudo"
- ban 														//	/ban "pseudo"
- unban
- help = montre les cmd possible/  /help
done - message tu n es pas admin vas te faire encule tu t es tromper encule tu t es tromper tu n es bon qu a boycoter encule tu t es tromper
bug sysmessae

*/


import * as React from "react";
import "../../../styles/MainPage/Chat/Chat.css";
import Send from '../../../assets/send.png';
import { Socket } from "socket.io-client";
// import ChatMenu from "./chatMenu";
import { User } from '../../../interfaces'
import MessageItem from "./message";
import Select from 'react-select';

export class Message{
	message: string;
	dest: string;
	sender: string;
	date: Date;
	constructor(Cont:string , dest:string, sender: string, date:Date){
		this.message = Cont;
		this.sender = sender;
		this.dest = dest;
		this.date = date;
	}
	resetCont(){
		this.message = "";
		this.sender = "";
		this.dest = "";
	}
}

export interface Msg{
	id: number;
	sender: string;
	dest:string;
	message:string;
	date:Date;
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

export default class Chat extends React.Component <{socket:Socket, User:User}, {placeHolder:string,openNewPass:boolean,openNewRoom:boolean,RowsStyle:string;activeRoom:string, msgInput:string, rooms:any, loaded:boolean, date:string, loadEmoji:boolean,chosenEmoji:any,chatInput:any, messages:Msg[]}>{
	mRef:HTMLDivElement | null;
	inputRef:HTMLInputElement | null;

	needPass:string = "";

	constructor(props:any) {
		super(props);
		this.mRef = null;
		this.inputRef = null;
		this.state = {
			placeHolder:"general",
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
		this.props.socket.on('deleted',  (data:any) => {
			this.props.socket.emit("joinRoom",{room:"general"})
        });
		this.props.socket.on('LoadRoomPass',  (data:any) => {
			this.togglePopupPass()
			this.setState({messages: data.msg, activeRoom: data.room})
        });
		this.props.socket.on('loadRoom',  (data:any) => {
			console.log(data.room)
			this.setState({openNewPass: false, openNewRoom:false})
			this.setState({messages: data.msg, activeRoom: data.room})
			if (this.mRef)
				this.mRef.scrollTop = this.mRef.scrollHeight;
		});
		this.props.socket.on("placeHolder", (data:any) => {
			this.setState({placeHolder:data.name})
		});
		this.props.socket.on('ReceiveMessage',  (data:any) => {
			console.log(data);
			if (data.dest == this.state.activeRoom){
				this.setState({messages: this.state.messages.concat([data])})
				if (this.mRef)
					this.mRef.scrollTop = this.mRef.scrollHeight;
			}
        });
		this.props.socket.on('updateRooms', (data:any) => {
			console.log(data.rooms.at(1).options);
			data.rooms.at(1).options= this.setPrivName(data.rooms.at(1).options)


			this.setState({rooms:data.rooms, loaded:true});
		});
		this.props.socket.on('needPassword', (data:any) => {
			this.needPass = data.room;
			this.setState({messages: []})
			this.setState({RowsStyle:"40px auto 40px"})
			this.setState({openNewPass:true})
		})

	}

	setPrivName(data:opt[]){
			data.forEach((element:opt) => {
				var parse = element.label.split('-').at(1)
				if (parse)
					var nick = parse.split(' ').at(0)
				var nickOther = element.label.split('/').at(1)
				if (nick && nickOther){
					if (this.props.User.nickname === nick)
						element.label = nickOther
					else
						element.label = nick
				}
			});
			return data
	
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
			var date = new Date()
			if (this.inputRef)
				if (this.state.activeRoom && this.inputRef.value !== "") {
					var toSend = {sender:this.props.User.login, dest:this.state.activeRoom, message:this.inputRef.value, date:date};
					console.log(toSend)
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
        this.setState({openNewRoom:false})
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


	handlePopUpRoom = () => {
		if (this.state.openNewPass === false){
			this.setState({messages: []})
			this.setState({openNewRoom:true})
		}
    };


	sendPass = () => {
		var pass = document.getElementById("passRequest") as HTMLInputElement;
		this.props.socket.emit('password', {pass:pass.value, room:this.needPass})
	}

	togglePopupPass = () => {
		this.setState({openNewPass:false});
	}

	handleChange = (selectedOption:any) => {
		this.props.socket.emit('joinRoom',{room:selectedOption.value})
	}


	render(){

		return (
			<div className="chatContainer" id="chatContainer" style={{gridTemplateRows:this.state.RowsStyle}}>
				<div className="chattext">
					<input onKeyPress={this.inputEnter} onChange={(e:any) => this.setState({chatInput: this.state.chatInput + e.target.value})} ref={this.setInputRef} type="text" placeholder="     Text message" autoComplete="off" id='inputText' className="inputChat" />

				</div>
				<div className="chatsend">
					<img src={Send} alt="" className="send" defaultValue='NULL' width='25px' height='25px' onClick={this.sendMessage} />
				</div>
				<div className="back"></div>


				<div className="chatinfo" id ="chatinfo" style={{}}>
					<div className="topbar">
			        	<Select className="SelectRoom"
						        options={this.state.rooms}
								id="selectRoom"
								onChange={this.handleChange}
								placeholder={this.state.placeHolder}
								value = {this.state.activeRoom}
								defaultValue= {this.state.activeRoom}
								/>
						<button className="buttonAdd" onClick={this.handlePopUpRoom} >+</button>
						</div>

				</div>
				<div id="chatmessage" ref={this.messagesRef} className="chatmessage">
					{this.state.openNewRoom === true && <Popup
                    content={<>
                        <b>Create a New Room :</b>
                        <input type="text" placeholder="name" id="nameNewRoom" className="inputPopUp"/>
                        <input type="password" placeholder="password (optionnal)" id="passNewRoom" className="inputPopUp"/>
                        <button onClick={this.sendNewRoom} className="buttonPopUp1">Send</button>
                        <button onClick={()=> this.setState({openNewRoom:false})} className="buttonPopUp">Cancel</button>
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
						this.state.messages.map((item, index) => {
							return (
								<MessageItem key={"key"+ index} msg={item} User={this.props.User} activeRoom={this.state.activeRoom} socket={this.props.socket} class={(item.sender === this.props.User.login) ? true :false}/>
							)
						})
					}
				</div>
				</div>
		)
	}
}
