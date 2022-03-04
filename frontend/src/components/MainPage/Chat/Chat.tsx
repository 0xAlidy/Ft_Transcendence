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
// import { v4 as uuidv4 } from 'uuid';

export interface Msg{
	id: number;
	sender: string;
	dest:string;
	message:string;
	date:Date;
	uuid:string;
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

export default class Chat extends React.Component <{socket:Socket, User:User}, {openNewHelp:boolean,placeHolder:string,openNewPass:boolean,openNewRoom:boolean,RowsStyle:string;activeRoom:string, msgInput:string, rooms:any, loaded:boolean, date:string, loadEmoji:boolean,chosenEmoji:any,chatInput:any, messages:Msg[]}>{
	mRef:HTMLDivElement | null;
	inputRef:HTMLInputElement | null;

	needPass:string = "";

	constructor(props:any) {
		super(props);
		this.mRef = null;
		this.inputRef = null;
		this.state = {
			openNewHelp:false,
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
		this.props.socket.on('help', (data:any) => {
            this.handlePopUpHelp();
        });
		this.props.socket.on('loadRoom',  (data:any) => {
			var ret;
			this.setState({openNewPass: false, openNewRoom:false})
			ret = this.deleteMsgFromBlocked(data.msg)
			this.setState({messages: []})
			this.setState({messages: ret, activeRoom: data.room})
			if (this.mRef)
				this.mRef.scrollTop = this.mRef.scrollHeight;
		});
		this.props.socket.on("reloadChatBlock", (data:any) => {
			this.removeBlockedMessage(data.login)
			this.props.socket.emit('blockUserChat', data)
		});
		this.props.socket.on("reloadChatUnblock", (data:any) => {
			this.props.socket.emit('unblockUserChat', data)
		});

		this.props.socket.on("placeHolder", (data:any) => {
			var ret = data.name;
			if(ret.startsWith('-'))
			{
				var parse = ret.split('-').at(1);
				if(parse)
				{
					var loginOne = parse.split(' ').at(0);
					var loginTwo = parse.split('/').at(1);
					if(loginOne === this.props.User.login)
						ret = loginTwo;
					if(loginTwo === this.props.User.login)
						ret = loginOne;
				}
			}
			this.setState({placeHolder:ret})
		});
		this.props.socket.on('ReceiveMessage',  (data:any) => {
			if (data.dest === this.state.activeRoom){
				if(this.props.User.blockedUsers.indexOf(data.sender) === -1)
					this.setState({messages: this.state.messages.concat([data])})
				if (this.mRef)
					this.mRef.scrollTop = this.mRef.scrollHeight;
			}
        });
		this.props.socket.on('updateRooms', (data:any) => {
			data.rooms.at(1).options = this.deleteOtherPrivRoom(data.rooms.at(1).options);
			data.rooms.at(1).options = this.setPrivName(data.rooms.at(1).options)
			this.setState({rooms:data.rooms, loaded:true});
		});
		this.props.socket.on('needPassword', (data:any) => {
			this.needPass = data.room;
			this.setState({messages: []})
			this.setState({RowsStyle:"40px auto 40px"})
			this.setState({openNewPass:true})
			this.props.socket.emit('popUpActive', {room:this.state.activeRoom})
		})
	}
	removeBlockedMessage(login:string){
		var temp = this.state.messages;
		this.state.messages.forEach((value:Msg) => {
			if(value.sender !== login)
				temp.push(value)
		})
		this.setState({messages:temp});
	}
	addUnblockedMessage(login:string){
		var temp = this.state.messages;
		this.state.messages.forEach((value:Msg) => {
			if(value.sender !== login)
				temp.push(value)
		})
		this.setState({messages:temp});
	}
	deleteMsgFromBlocked(data:Msg[]){
		var todel:number[] = [];
		data.forEach((element:Msg, index:number) => {
			if(this.props.User.blockedUsers.indexOf(element.sender) !== -1)
				todel.push(index);
		});
		todel.slice().reverse().forEach((idx) => {
			data.splice(idx,1);
		})
		return data
	}
	deleteOtherPrivRoom(data:opt[]){
		var todel:number[] = [];
		data.forEach((element:opt, index:number) => {
			var parse = element.label.split('-').at(1)
			if (parse){
				var nick = parse.split(' ').at(0)
				var nickOther = parse.split('/').at(1)
				if(nick !== this.props.User.nickname && nickOther !== this.props.User.nickname)
					todel.push(index);
			}
		});
		todel.slice().reverse().forEach((idx) => {
			data.splice(idx,1);
		})
		return data
	}
	setPrivName(data:opt[]){
			data.forEach((element:opt) => {
				var parse = element.label.split('-').at(1)
				if (parse){
					var nick = parse.split(' ').at(0)
					var nickOther = parse.split('/').at(1)
				}
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
			if (this.state.openNewHelp === true || this.state.openNewPass === true || this.state.openNewRoom === true)
				return
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
			this.props.socket.emit('popUpActive', {room:this.state.activeRoom})
			this.setState({openNewRoom:true})
		}
    };

	handlePopUpHelp = () => {
        if (this.state.openNewPass === false && this.state.openNewRoom === false){
            this.setState({messages: []})
			this.props.socket.emit('popUpActive', {room:this.state.activeRoom})
            this.setState({openNewHelp:true})
        }
    };


	sendPass = () => {
		var pass = document.getElementById("passRequest") as HTMLInputElement;
		this.props.socket.emit('password', {pass:pass.value, room:this.needPass})
	}

	togglePopupPass = () => {
        this.setState({openNewPass:false});
        this.props.socket.emit('cancelPass', {room:this.state.activeRoom});
    }

	togglePopupHelp = () => {
        this.setState({openNewHelp:false});
        this.props.socket.emit('cancelPass', {room:this.state.activeRoom});
    }

    togglePopupRoom = () => {
        this.setState({openNewRoom:false});
        this.props.socket.emit('cancelPass', {room:this.state.activeRoom});
    }

	handleChange = (selectedOption:any) => {
		this.props.socket.emit('joinRoom',{room:selectedOption.value})
	}

	render(){

		return (
			<div className="chatContainer" id="chatContainer" style={{gridTemplateRows:this.state.RowsStyle}}>
				<div className="chattext">
					<input onKeyPress={this.inputEnter} ref={this.setInputRef} type="text" placeholder="     Text message" autoComplete="off" id='inputText' className="inputChat" />

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
                        <button onClick={this.togglePopupRoom} className="buttonPopUp">Cancel</button>
                      </>}
                	/>}

				{this.state.openNewHelp === true && <Popup
                    content={<>
                        <p>welcome to the chat commands you have multiple command you can try:<br/>
                            - /setadmin "nickname": to define another admin in the room<br/>
                            - /password "new_password": to change existing password, you need to be owner of the room to do that<br/>
                            - /delete password: delete the password of the room, you need to be owner of the room to do that<br/>
                            - /unban "user_to_unban": to unban an user from the room<br/>
                            - /mute "user_to_mute" "time_in_minute": to mute an user for a limited time<br/>
                            - /delete :to delete the room, you need to be owner of the room to do that<br/>
                            please use the good number of argument else your command will not work<br/>
                            please be polite and don't insult other user</p>
                        <button onClick={this.togglePopupHelp} className="buttonPopUp">Quit</button>
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
						this.state.messages.map((item:Msg, index) => {
							return (
								<MessageItem key={item.uuid} msg={item} User={this.props.User} activeRoom={this.state.activeRoom} socket={this.props.socket} class={(item.sender === this.props.User.login) ? true :false}/>
							)
						})
					}
				</div>
				</div>
		)
	}
}
