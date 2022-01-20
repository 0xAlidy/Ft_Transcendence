import * as React from "react";
import Select from 'react-select';
import { Room } from "./class";
import MenuPng from '../../../assets/menu.png'


export default class ChatMenu extends React.Component <{roomList:Room[], newRoom: any}, {activeRoom:string | null, inputRoomName:string, roomList:Room[], options:any}>{
	
	general: Room = {name:"general", id:0, password:"", userList:[]};
	
    constructor(props:any) {
		super(props)
        this.state = {
			options: [{value:"general", label:"general"}],
			activeRoom: null,
            inputRoomName: '',
			roomList: this.props.roomList,
        }
		// for (var i = 1; i < this.props.roomList.length; i++){
		// 	this.state.options.push({value:this.props.roomList[i].name, label:this.props.roomList[i].name})
		// }
	};


	componentDidUpdate(prevprops:any)
	{
		console.log(this.state.roomList)
		if (prevprops.roomList !== this.props.roomList){
			console.log("dedans")
			this.setState({roomList:this.props.roomList})
			this.convert();
		}

	}
	
	componentDidMount()
	{
		console.log("roomlistdidmount")
		console.log(this.state.roomList)
		this.convert();
	}

	convert = () => {
		var temp = [];
		for (var i = 0; i < this.props.roomList.length; i++){
			temp.push({value:this.props.roomList[i].name, label:this.props.roomList[i].name})
		}
		this.setState({options:temp})
		console.log(this.state.options)
	}
	joinRoom = () => {
		var selectValue = (document.getElementById('selectRoom') as HTMLSelectElement).value;
		console.log(selectValue);
	}
	handleChange = (selectedOption:any) => {
		console.log(selectedOption)
        this.setState({activeRoom:selectedOption})
	}
	
    hoverEvent = () => {
        var chatMenu = document.getElementById("chatContainer") as HTMLDivElement;
        chatMenu.setAttribute('style', "grid-template-rows: 90% auto 40px;");
    };
    hoverLeaveEvent = () => {
        var chatMenu = document.getElementById("chatContainer") as HTMLDivElement;
        chatMenu.setAttribute('style', "grid-template-rows: 4% auto 40px;");
    };
    sendRoomName = (event:any) => {
            this.setState({inputRoomName:event.target.value})
    }
    submitRoomName = () =>{
        this.props.newRoom(this.state.inputRoomName)
    }

	render(){
		return (
			<div className="chatinfo" id ="chatinfo" onMouseEnter={this.hoverEvent} onMouseLeave={this.hoverLeaveEvent}> 
					<div className="topbar">
						<img src={MenuPng} alt="maqueue" className="iconMenu" width='22px' height='22px' />
						<div className="tittle">Chat</div>
				
					</div>
			        <Select className="SelectRoom" 
					        options={this.state.options}
					        id="selectRoom"
					        onChange={this.handleChange}
					        placeholder="join a room"
					/>
					<div className="divFormMenu">
                        <input onChange={this.sendRoomName} type="text" value={this.state.inputRoomName} id="newRoomInput" autoComplete="off" placeholder="New Room" className="menuInput"/>
	   					<button className="pseudoButton" onClick={() => this.props.newRoom(this.state.inputRoomName)}>Add</button>
	   				</div>
				</div>
		)
	}
}