import * as React from "react";
import "../../../styles/MainPage/Chat/Chat.css"
import room from './class';
import Send from '../../../assets/send.png'
import { socket } from "../MainPage";
// import Select from 'react-select';

// export const socket = io('http://localhost:667');

class Message{
	message: string;
	Time: number;
	dest: string;
	sender: string;
	constructor(msg:string , dest:string, sender: string){
		this.message = msg;
		this.sender = sender;
		this.dest = dest;
		this.Time = Date.now();
	}
}

class opt{
	label: string;
	value: string;
	constructor(){
		this.label = "";
		this.value = "";
	}
}

export default class Chat extends React.Component{

	//---------//

	username: string = "";
	general: room = {name:"general", password:"", userList:[]};
	general2: room = {name:"general2", password:"123", userList:["toto"]};
	roomList: room[] = [];
	// lol: opt = {label:"yo", value:"yo"}
	roomOpt: opt[] = [];
	rooooom:any;

	//---------//

	constructor(props:any) {
		super(props)
		this.roomList.push(this.general);
		this.roomList.push(this.general2);
		// this.roomOpt.push(this.lol);
		socket.on('sendRoomlist', function (data:any) {
			console.log(data.rooms)
		});
	};

	getRoomList = () => {
		console.log("update roomList")
		socket.emit("getRoomList");
	};
	sendMessage = () => {
		var input = (document.getElementById('inputText') as HTMLInputElement).value;
		var ne = new Message(input, '<yourDest>', '<yourUsername>'); //a envoyer a la database, le back dispatchera les messages aux user concerne. le back enverra un msg socket pour refresh les msg affiche
		console.log(ne);
	}
	showMenu = () => {
		var menu = (document.getElementById("chatMenu") as HTMLDivElement);
		if (menu.style.getPropertyValue("display") === "block")
			menu.style.setProperty("display", "none");
		else
			menu.style.setProperty("display", "block");
	};

	sendUsername = () => {
		var user = document.getElementById("usernameInput") as HTMLInputElement;
		if (user){
			this.username = user.value;
			console.log("you now logged as => " + this.username);
		}
	};

	select = () => {
		console.log(this.roomList);
		this.roomList.forEach((element) => {
			this.roomOpt.push({
			   label: element.name,
			   value: element.name,
			})
		},)
		console.log(this.roomOpt);
		// this.rooooom = Object.keys(this.roomOpt).map((k) => {
		// 	return (
		// 		<option key={k} value={k}>{this.roomOpt[k]}</option>
		// 	)
		// },)
		// return (
		// 	<div>
		// 		<select>
		// 			{rooooom}
		// 		</select>
		// 	</div>
		//  );
		// console.log("HEEERREE")
		// console.log(this.roomOpt);
		// var sel = document.getElementById("selectroom") as HTMLSelectElement;
		// console.log(sel.value);
	};

	render(){
			return (
				<div className="chatContainer">

				<div className="chattext">
					<input placeholder="     Text message" id='inputText' className="inputChat" />
				</div>

				<div className="chatsend">
					<img src={Send} alt="mabite" className="send" defaultValue='NULL' width='22px' height='22px' onClick={this.sendMessage}/>
				</div>

				<div className="back" >

				</div>

				<div className="chatinfo">
					<img src={Send} alt="maqueue" className="iconMenu" width='22px' height='22px' onClick={this.showMenu}/>
					<div className="chatMenu" id="chatMenu" >

					<div className="usernameInputDiv">
     			    		<input  type="text" id="usernameInput" placeholder="pseudo"/>
     			    		<button  type="button" onClick={this.sendUsername}>lock</button>
     				</div>

					<div className="select">
						{//<select options={this.roomOpt} />;    Select
							}
						{/* <select className="menu-input" onClick={this.select} id="selectroom">
							{this.roomOpt.map(fbb =>
      							<option key={fbb.key} value={fbb.key}>{fbb.value}</option>
    						)};
						</select> */}
						<button className="menu-button" id="joinSelected">join</button>
					</div>

					{/* <div className="password" id="password">
						<input className="menu-input" type="password" id="passRoom" placeholder="this room need a password"/>
						<button className="menu-button" id="passButton">Enter</button>
					</div>

					<button className="menu-button" >Add Room</button>
					<div className="addRoom" id="addRoom">
							<input className="menu-input" id="inputNewRoom" placeholder="add a new room"></input>
							<input className="menu-input" id="inputPassRoom" placeholder="add a password (optionnal)"></input>
							<button className="menu-button" id="addbutton" >add</button>
					</div> */}

					</div>
				<div className="chatmessage">
				</div>
			</div>
			</div>
		)
	}
}

// componentDidMount(){
// }

// showMenu(){
//     return (
//         <div className="Menu">
//         <div className="username">
//             <form>
//                 <input className="menu-input" type="text" id="username" placeholder="pseudo"/>
//             <button className="menu-button" type="submit" onClick={sendUsername}>lock</button>
//             </form>
//         </div>
//     </div>
//     )
// }

// // sendUsername(){
// //     username = document.getElementById("username").value;
// //     console.log("hello " + store.username);
// //     this.socket.emit('newConnection', {username: store.username});
// //     document.getElementById("username").disabled = true;
// //     store.active_room = "general";
// // }

// render() {
//     return (
//         //<link rel="stylesheet" href="style.css"></link>
//         <div id="chat_app">


// 	    	<div className={"top-bar"}>
// 	    		<img src="/assets/menu.png" className="button-menu" onClick={showMenu}></img>
// 	    		<input className="tittle" id="tittle" disabled value="general"/>
// 	    	</div>







// 	    	<div className="select">
// 	    			<select className="menu-input" id="selectroom" onClick={getSelect}>
// 	    				<option value="general">Général</option>
// 	    			</select>
// 	    			<button className="menu-button" id="joinSelected" onClick={joinRoom}>join</button>
// 	    	</div>



// 	    	<div className="password" id="password">
// 	    		<input className="menu-input" type="password" id="passRoom" placeholder="this room need a password"/>
// 	    		<button className="menu-button" id="passButton" onClick={checkPass}>Enter</button>
// 	    	</div>




// 	    	<button className="menu-button" >Add Room</button>
// 	    	<div className="addRoom" id="addRoom">
// 	    			<input className="menu-input" id="inputNewRoom" placeholder="add a new room"></input>
// 	    			<input className="menu-input" id="inputPassRoom" placeholder="add a password (optionnal)"></input>
// 	    			<button className="menu-button" id="addbutton" onClick={addRoom}>add</button>
// 	    	</div>




// 	    	<div className="chat">
// 	    		<ul id="chatbox">
// 	    		</ul>
// 	    	</div>



// 	    	<div className="chat-input">
// 	    			<input type="text" autoComplete="off" id="text" className="msg-input"/>
// 	    			<img src="/assets/send.png" className="button-send" onClick={sendChatMessage}></img>
// 	    	</div>
// 	    </div>
// )
// }
