import React, { useState } from 'react'
import axios from 'axios';
import ProfileShortCut from '../MainPage/ProfileShortcut';
import { Socket } from 'socket.io-client';


export default class Nickname extends React.Component<{login:string},{nickname:string|null}>{
	constructor(props:any)
	{
		super(props)
		this.state = {nickname:null}
	}
	async componentDidMount(){
		await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/user/getNickname?login=" + this.props.login).then(res => {
			this.setState({nickname: res.data})
		})
	}
	render(){
		return <>{this.state.nickname && this.state.nickname}</>
	}
};

export function InviteNotif(props:{login:string, token:string, socket:Socket}){
	return (<>
			{"✌️ You receive a friend request!"}
			<br/>
			<div style={{display: 'flex',width:'100%'}}>
				<ProfileShortCut pseudo={props.login} token={props.token} socket={props.socket} canOpen={true}/>
				<div style={{fontWeight:'bolder', fontSize:'20pt',margin:'auto auto', color:"#fee154"}}>{props.login}</div>
			</div>
			</>);
  }
  export function InviteButton(props:any){
	// Vous pouvez utiliser des Hooks ici !
	const accept = () =>{
		props.socket.emit('acceptFriend', {login:props.login})
		props.closeToast()
	}
	const deny = () =>{
		props.socket.emit('denyFriend', {login:props.login})
		props.closeToast()
	}

	return (<>
					<button style={{fontSize:'20pt', width:'50px', height:'50px', borderRadius:'50%', backgroundColor:'#fee154'}} onClick={() => accept()}>✓</button>
					<button style={{fontSize:'20pt', width:'50px', height:'50px', borderRadius:'50%', backgroundColor:'#cc0000'}} onClick={() => deny()}>X</button>
			</>)
  }

  export function DuelNotif(props:{login:string, token:string, socket:Socket}){
	// Vous pouvez utiliser des Hooks ici !
	const [resp, setResp] = useState(0);
	const accept = () =>{
		//accept invite
		setResp(1)
	}
	const deny = () =>{
		//accept invite
		setResp(2)
	}

	return (<>
			{"⚔️ You receive a duel request!"}
			<br/>
			<div style={{display: 'flex',width:'100%'}}>
				<ProfileShortCut pseudo={props.login} token={props.token} socket={props.socket} canOpen={true}/>
				{resp === 0 && <>
					<div style={{fontWeight:'bolder', fontSize:'20pt',margin:'auto auto', color:"#fee154"}}>{props.login}</div>
					<button style={{fontSize:'20pt', width:'50px', height:'50px', borderRadius:'50%', backgroundColor:'#fee154'}} onClick={() => accept()}>⚔️</button>
					<button style={{fontSize:'20pt', width:'50px', height:'50px', borderRadius:'50%', backgroundColor:'#cc0000'}} onClick={() => deny()}>deny!</button>
				</>}
				{resp === 1 &&<div style={{margin:'auto auto', color:"#fee154"}}>You now friend with {props.login}!</div>}
				{resp === 2 && <div style={{margin:'auto auto', color:"#fee154"}}>You deny friend request!</div>}
			</div>
			</>);
  }
