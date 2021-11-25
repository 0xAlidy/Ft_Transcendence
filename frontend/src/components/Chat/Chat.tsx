import * as React from "react";
import "../../styles/Chat.css"
import { io } from "socket.io-client";
import room from './class';
import "../../styles/Chat.css"

export const socket = io('http://localhost:667');



export default class Chat extends React.Component{
	
	//---------//
	
	roomList: room[];
	username: string;
	general: room;
	
	//---------//
	
	constructor(props:any) {
		super(props)
		this.roomList = [];
		this.username = "";
		this.general = {name:"general", password:"", userList:[]};
		this.roomList.push(this.general);

		socket.on('sendRoomlist', function (data:any) {
			console.log(data.rooms)
		});
	}
	
	//---------//
	
	private user = React.createRef<HTMLInputElement>();
	
	//---------//

	getUsername() {
		const user = this.user.current;
		if (user)
			this.username = user.value;
		console.log("you now logged has => " + this.username);
	};
	getRoomList(){
		console.log("update roomList")
		socket.emit("getRoomList");
	};

	render(){
		return (
			
			<div className="chatApp" >

				<div className="username">
					<input type="text" placeholder="enter a pseudo" id="username" ref={this.user} />
					<button type="submit" onClick={() => this.getUsername()}>Send</button>
				</div>

				<div className="roomlist">
					<button type="submit" id="getRoom" onClick={() => this.getRoomList()}>Room</button>
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