import * as React from "react";
import Select from 'react-select';
//import { Room } from "./class";
import MenuPng from '../../../assets/menu.png'
import { Socket } from "socket.io-client";


export default class ChatMenu extends React.Component <{socket:Socket , roomList:any, newRoom: any, actRoom:any, onMenuOpen:any}, {activeRoom:string | null, inputRoomName:string, options:{value:string,label:string}[]}>{
	chatMenu:HTMLDivElement|null;
	//general: Room = {name:"general", id:0, password:"", userList:[]};
	default = {value:"general", label:"general"}
	flipflap:boolean;
    constructor(props:any) {
		super(props)
        this.state = {
			options: [],
			activeRoom: null,
            inputRoomName: '',
			// roomList: this.props.roomList,
        }
		this.chatMenu= null;
		this.flipflap = true;
	};
	setChatMenu = (r:HTMLDivElement) =>{
		this.chatMenu =  r;
	}

	// componentDidUpdate(prevprops:any){
	// 	if (prevprops.roomList !== this.props.roomList){
	// 		this.setState({roomList:this.props.roomList})
	// 		// this.convert();
	// 	}

	// }

	// componentDidMount(){
	// 	console.log(this.props.roomList)
	// 	this.convert();
	// }

	convert = (arr:string[]) => {
		var temp:any = [];
		arr.forEach(element => {
			temp.push({value: element, label:element})
		});
		return temp
	}

	handleChange = (selectedOption:any) => {
        this.setState({activeRoom:selectedOption.value})
		this.props.socket.emit('joinRoom',{room:selectedOption.value})
	}

    openMenu = () => {
		if(this.flipflap){
			this.flipflap = false;
			this.props.onMenuOpen('650px auto 40px')
		}else{
			this.flipflap = true;
			this.props.onMenuOpen('40px auto 40px')
		}
    };
    sendRoomName = (event:any) => {
            this.setState({inputRoomName:event.target.value})
    }

	handleButtonAdd = () => {
        this.openMenu();
        this.props.newRoom(true)
    };

	render(){
		// console.log(this.props.roomList)
		var opt:any = [];
		// console.log(opt)
		for (var key in this.props.roomList){
			opt.push({value:this.props.roomList[key], label:this.props.roomList[key]})
			// console.log(this.props.roomList[key])
		}
		return (
			<div className="chatinfo" id ="chatinfo" style={{}} ref={this.setChatMenu}>
					<div className="topbar">
						<img src={MenuPng} alt="maqueue" className="iconMenu" width='22px' height='22px' onClick={this.openMenu} />
						<div className="tittle">Chat</div>
					</div>
					<div className="hiddenMenu">
			        	<Select className="SelectRoom"
						        options={this.props.roomList}
						        id="selectRoom"
						        onChange={this.handleChange}
						        placeholder="join a room"
								defaultValue={{value:this.props.actRoom, label:this.props.actRoom}}
								/>
						<button className="buttonAdd" onClick={this.handleButtonAdd} >+</button>
					</div>
				</div>
		)
	}
}
