import React from 'react'
import '../../../src/styles/MainPage/profileShortcut.css'
import axios from 'axios';
import Popup from 'reactjs-popup';

interface userPublic{
	imgUrl: string;
	isActive: false;
	lvl: number;
	name: string;
	nickname: string;
	numberOfLoose: number;
	numberOfWin: number;
	xp: number;
}
export default class ProfileShortCut extends React.Component<{pseudo:string, token:string, canOpen:boolean},{opened:boolean, User:userPublic|null}>{
	MatchList: any = [];
	constructor(props:any) {
		super(props)
		this.state={
				opened:false,
				User:null,
			}
	};
	async componentDidMount() {
		await axios.get("http://" + window.location.host.split(":").at(0) + ":667/user/getUser?token="+ this.props.token +'&name='+ this.props.pseudo)
		.then(res => this.setState({User: res.data}))
	}

	addFriend = () =>{
		
	}

	render(){
		return (
			<>
				{this.state.User &&
					<div className="profileShortcut">
						<Popup open={this.state.opened && this.props.canOpen} closeOnEscape={true} closeOnDocumentClick={true} onClose={() =>{this.setState({opened:false})}}>
							<div className="PopupContainer">
								<div id='profilSection'>
									<span>
										<img alt="UserImage" src={this.state.User.imgUrl} style={{borderRadius:"50%"}}/>
									</span>
									<div className="popupName">{this.state.User.nickname}</div>
								</div>
								<div id='levelSection'>
									<div className="lvl">LEVEL<br/>{this.state.User.lvl}</div>
									<div className="ratio">W/L<br/>{this.state.User.numberOfWin+'/'+this.state.User.numberOfLoose}</div>
								</div>
								<div id='buttonSection'>
									<div className="mp">
										<button className='ProfileShortcutButton'>MP</button>
									</div>
									<div className="addFriend">
										<button className='ProfileShortcutButton' onClick={this.addFriend}>addFriend</button></div>
									<div className="duel">
										<button className='ProfileShortcutButton'>DUEL</button></div>
									<div className="history">
										<button className='ProfileShortcutButton'>HISTORY</button></div>
								</div>
							</div>
						</Popup>
						<img alt="UserProfile" src={this.state.User.imgUrl} style={{maxHeight:'100%'}} onClick={() =>{this.setState({opened:true})}}/>
					</div>
				}
			</>
    	)
	}
};
