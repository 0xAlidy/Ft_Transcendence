import * as React from "react";
import Select from 'react-select';
// import { Select} from '@mobiscroll/react';
// import { Room } from "./class";
import MenuPng from '../../../assets/menu.png'
import { Socket } from "socket.io-client";

interface opt{
	label:string,
	value:string
}

interface groupeOpt{
	label:string,
	options:opt[],
}


export default class ChatMenu extends React.Component <{socket:Socket , roomList:opt[], newRoom: any, actRoom:any, onMenuOpen:any}, {groupedOptions:groupeOpt[],userOpt:opt[],activeRoom:string | null, inputRoomName:string, options:opt[]}>{
	chatMenu:HTMLDivElement|null;
	//general: Room = {name:"general", id:0, password:"", userList:[]};
	//default = {value:"general", label:"general"}
	flipflap:boolean;
    constructor(props:any) {
		super(props)
        this.state = {
			options: [],
			userOpt:[{value:"ge", label:"ge"},{value:"ral", label:"ral"},{value:"toto", label:"toto"},{value:"lololo", label:"lololo"}],
			groupedOptions: [{label: "Room", options: [{value:"ge", label:"ge"},{value:"ral", label:"ral"},{value:"toto", label:"toto"},{value:"lololo", label:"lololo"}]},{label: "Flavours",options: this.props.roomList}],
			activeRoom: null,
            inputRoomName: '',
        };
		this.chatMenu= null;
		this.flipflap = true;
	};
	setChatMenu = (r:HTMLDivElement) =>{
		this.chatMenu =  r;
	}
	// componentDidUpdate(prevprops:any){
	// 	if (prevprops.roomList !== this.props.roomList){
	// 		this.convert(this.props.roomList);
	// 	}

	// }

	// componentDidMount(){
	// 	console.log(this.props.roomList)
	// 	this.convert(this.props.roomList);
	// }

	// convert = (arr:string[]) => {
	// 	var temp:any = [];
	// 	arr.forEach(element => {
	// 		temp.push({value: element, label:element})
	// 	});
	// 	return temp
	// }

	handleChange = (selectedOption:any) => {
		console.log(selectedOption.value)
        this.setState({activeRoom:selectedOption.value})
		this.props.socket.emit('joinRoom',{room:selectedOption.value})
	}

    openMenu = () => {
		if(this.flipflap){
			this.flipflap = false;
			this.props.onMenuOpen('250px auto 40px')
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
						        options={this.state.groupedOptions}
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
