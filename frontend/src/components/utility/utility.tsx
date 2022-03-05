import React from 'react'
import axios from 'axios';
import ProfileShortCut from '../MainPage/ProfileShortcut';
import '../../styles/MainPage/utility.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Socket } from 'socket.io-client';
import { User } from '../../interfaces';


export default class Nickname extends React.Component<{login:string},{nickname:string|null}> {
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


/* FRIEND REQUEST POPUP */

export function InviteNotif(props:{login:string, socket:Socket, user:User}){
	return (
		<>
			<div className='titleNotif'>
				<FontAwesomeIcon className="NotifIcon" icon={solid('user-plus')}/>
				<h2>You received a friend request</h2>
			</div>
			<div className='profileNotif'>
				<ProfileShortCut login={props.login} User={props.user} socket={props.socket} />
				<h3>{props.login}</h3>
			</div>
		</>
	);
}

export function InviteButton(props:any){

	const accept = () =>{
		props.socket.emit('acceptFriend', {login:props.login})
		props.closeToast()
	}

	const deny = () =>{
		props.socket.emit('denyFriend', {login:props.login})
		props.closeToast()
	}

	const block = () =>{
		props.socket.emit('blockUser', {login:props.login})
		props.closeToast()
	}

	props.socket.on('closeInviteFriend', (data:any) => {
		if (data.login === props.login)
			props.closeToast()
	})

	return (
		<div className='buttonNotifWrap'>
			<button className='buttonNotif' onClick={() => accept()}>
				<FontAwesomeIcon className="buttonIcon" icon={solid('check')}/>
			</button>
			<button className='buttonNotif' onClick={() => deny()}>
				<FontAwesomeIcon className="buttonIcon" icon={solid('xmark')}/>
			</button>
			<button className='buttonNotif' onClick={() => block()}>
				<FontAwesomeIcon className="buttonIcon" icon={solid('ban')}/>
			</button>
		</div>
	)
  }

/* DUEL POPUP */

  export function DuelButton(props:any){

	const accept = () =>{
		props.socket.emit('joinPrivateSession', {room:props.room})
		props.closeToast()
	}

	const deny = () =>{
		props.socket.emit('denyDuel', {login:props.login, room:props.room})
		props.closeToast()
	}

	props.socket.on('closeInviteNotif'+props.login, (data:any) => {
		props.closeToast()
	})

	props.socket.on('startGame', () => {
		props.closeToast()
	})

	return (
		<div className='buttonNotifWrap'>
			<button className='buttonNotif' onClick={() => accept()}>
				<FontAwesomeIcon className="buttonIcon" icon={solid('check')}/>
			</button>
			<button className='buttonNotif' onClick={() => deny()}>
				<FontAwesomeIcon className="buttonIcon" icon={solid('xmark')}/>
			</button>
		</div>
	)
  }

  	export function DuelNotif(props:{login:string, user:User, socket:Socket, arcade:boolean}){
		return (
			<>
				<div className='titleNotif'>
					{
						props.arcade ?
							<FontAwesomeIcon className="NotifIcon" icon={solid('hat-wizard')}/>
						:
							<FontAwesomeIcon className="NotifIcon" icon={solid('hand-fist')}/>
					}
					<h2>You received a duel request</h2>
				</div>
				<div className='profileNotif'>
					<ProfileShortCut login={props.login} User={props.user} socket={props.socket} />
					<h3>{props.login}</h3>
				</div>
			</>
		);
	}

	export function PendingSearchButton(props:any){

		const deny = () =>{
			props.socket.emit('cancel')
			props.closeToast()
		}
		props.socket.on('SearchStatus', (data:any) => {
			if(data.bool === false)
				props.closeToast()
		})
		props.socket.on('startGame', () => {
			props.closeToast()
		})
		return (
			<div className='buttonNotifWrap'>
				<button className='buttonNotif' onClick={() => deny()}>
					<FontAwesomeIcon className="buttonIcon" icon={solid('xmark')}/>
				</button>
			</div>
		)
	  }

	  export function PendingSearchNotif(props:any){
		return (
			<div className='titleNotif'>
				{
					props.arcade ?
						<FontAwesomeIcon className="NotifIcon" icon={solid('hat-wizard')}/>
					:
						<FontAwesomeIcon className="NotifIcon" icon={solid('hand-fist')}/>
				}
				<h2>Waiting for an opponent . . .</h2>
			</div>
		);
	}

	export function PendingInviteButton(props:any){

		const deny = () =>{
			props.socket.emit('cancelPrivate', {login:props.login});
			props.closeToast()
		}
		props.socket.on('closePendingNotif', () => {
			props.closeToast()
		})
		props.socket.on('startGame', () => {
			props.closeToast()
		})

		return (
			<div className='buttonNotifWrap'>
				<button className='buttonNotif' onClick={() => deny()}>
					<FontAwesomeIcon className="buttonIcon" icon={solid('xmark')}/>
				</button>
			</div>
		)
	  }

	  export function PendingInviteNotif(props:{login:string, user:User, socket:Socket, arcade:boolean}){
		return (
			<>
				<div className='titleNotif'>
					{
						props.arcade ?
							<FontAwesomeIcon className="NotifIcon" icon={solid('hat-wizard')}/>
						:
							<FontAwesomeIcon className="NotifIcon" icon={solid('hand-fist')}/>
					}
					<h2>Duel request sent</h2>
				</div>
				<div className='profileNotif'>
					<ProfileShortCut login={props.login} User={props.user} socket={props.socket} />
					<h3>{props.login}</h3>
				</div>
			</>
		);
	}
