import * as React from "react";
import Select from 'react-select';
import { Room } from "./class";
import MenuPng from '../../../assets/menu.png'


export default class ChatMenu extends React.Component <{roomList:Room[], newRoom: any, actRoom:any, onMenuOpen:any}, {activeRoom:string | null, inputRoomName:string, roomList:Room[], options:any}>{
	chatMenu:HTMLDivElement|null;
	general: Room = {name:"general", id:0, password:"", userList:[]};
	default = {value:"general", label:"general"}
	flipflap:boolean;
    constructor(props:any) {
		super(props)
        this.state = {
			options: [{value:"general", label:"general"}],
			activeRoom: null,
            inputRoomName: '',
			roomList: this.props.roomList,
        }
		this.chatMenu= null;
		this.flipflap = true;
	};
	setChatMenu = (r:HTMLDivElement) =>{
		this.chatMenu =  r;
	}

	componentDidUpdate(prevprops:any){
		if (prevprops.roomList !== this.props.roomList){
			this.setState({roomList:this.props.roomList})
			this.convert();
		}

	}

	componentDidMount(){
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
		console.log(selectedOption.value)
        this.setState({activeRoom:selectedOption.value})
		this.props.actRoom(selectedOption.value)
	}

    openMenu = () => {
		if(this.flipflap){
			this.flipflap = false;
			this.props.onMenuOpen('180px auto 40px')
		}else{
			this.flipflap = true;
			this.props.onMenuOpen('40px auto 40px')
		}
    };
    sendRoomName = (event:any) => {
            this.setState({inputRoomName:event.target.value})
    }
    submitRoomName = () =>{
        this.props.newRoom(this.state.inputRoomName)
    }

	render(){
		return (
			<div className="chatinfo" id ="chatinfo" style={{}} ref={this.setChatMenu}>
					<div className="topbar">
						<img src={MenuPng} alt="maqueue" className="iconMenu" width='22px' height='22px' onClick={this.openMenu} />
						<div className="tittle">Chat</div>
					</div>
			        <Select className="SelectRoom"
					        options={this.state.options}
					        id="selectRoom"
					        onChange={this.handleChange}
					        placeholder="join a room"
							defaultValue={this.state.options[0]}
					/>
					<div className="divFormMenu">
                        <input onChange={this.sendRoomName} type='text'  value={this.state.inputRoomName} id="newRoomInput" autoComplete="off" placeholder="New Room" className="menuInput"/>
	   					<button className="pseudoButton" onClick={() => this.props.newRoom(this.state.inputRoomName)}>Add</button>
	   				</div>
				</div>
		)
	}
}
