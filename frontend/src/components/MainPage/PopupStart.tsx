import React from 'react'
import '../../styles/MainPage/popup.css'
import Popup from 'reactjs-popup';
import AvatarEditor from 'react-avatar-editor';
import EditBox from './midPanel/Profile/editBox';
import TwoAuth from './midPanel/Profile/twoAuth';
import axios from 'axios';

interface user{
	WSId: string;
	id: number;
	imgUrl: string;
	isActive: false;
	lvl: number;
	login: string;
	nickname: string;
	numberOfLoose: number;
	numberOfWin: number;
	secret: string;
	secretEnabled: false;
	firstConnection: boolean;
	token: string;
	xp: 0;
}

export default class PopupStart extends React.Component<{ User:user, onChange:any},{ src:string | File,options:number, nickname:string, number:number | null, verify:boolean | null}>{
	editor:AvatarEditor | null;
	constructor(props :any) {
		super(props);
		this.state = {
			nickname: "nickname",
			number: null,
			verify: null,
			src: "https://cdn.intra.42.fr/users/medium_"+ this.props.User.login +".jpg",
			options: this.props.User.firstConnection ? 0 : (this.props.User.secretEnabled ? 1 : 2)
		};
		this.editor = null;
		this.handleNumberChange= this.handleNumberChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	setEditorRef = (editor: AvatarEditor) => {
		this.editor = editor;
	};

	validate = async () =>{
		// var headers = {
		// 	'Content-Type': 'application/json;charset=UTF-8',
		// 	"Access-Control-Allow-Origin": "*"
		// }
		if(this.editor){

			await axios.post("http://" + window.location.host.split(":").at(0) + ":667/user/completeProfile",{	url:this.editor.getImageScaledToCanvas().toDataURL(),
			token:this.props.User.token,
			nickname:this.state.nickname}).then((res) => {this.props.onChange(res.data)})
			this.setState({options:3})
		}
	}

	setName = (nickname:string) =>{
		console.log("Nickname to change :" + nickname)
		this.setState({nickname: nickname})
	}

	handleNumberChange(event:any){
		this.setState({ number: event.target.value});
	}

	async handleSubmit(event:any) {
		event.preventDefault();
		await axios.post("HTTP://" + window.location.host.split(":").at(0) + ":667/user/verifyNumber", {token: this.props.User.token, number: this.state.number}).then(resp =>
			this.setState({ verify:resp.data })
		);
		if (this.state.verify)
			this.setState({ options:3 })
	}

	async componentDidMount(){
		console.log(this.props.User)
		let file = await fetch("https://cdn.intra.42.fr/users/medium_"+ this.props.User.login +".jpg").then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))
		this.setState({src: file});
	}

	render(){
		return (
			<Popup open={this.state.options < 2} closeOnDocumentClick={false} >
				<div className="popup">
				{
					this.state.options === 0 && // PREMIERE CONNECTION
					<>
						Complete Profile
						<AvatarEditor ref={this.setEditorRef} crossOrigin='anonymous' image={this.state.src} width={100} height={100} borderRadius={100} color={[255, 255, 255, 0.6]} scale={1.1} rotate={0}/>
						<p>center your picture you can change it later</p>
						<EditBox onChange={this.setName} value={this.state.nickname} User={this.props.User} refreshUser={() => {}}/>
						<TwoAuth token={this.props.User.token}/>
						<button className='button' onClick={this.validate}>validate</button>
					</>
				}
				{
					this.state.options === 1 && // CONNECTION AVEC 2FA
					<>
						<form onSubmit={this.handleSubmit}>
							<label>Saisir le code de votre application: </label>
							<input type="number" name="code" id="number" onChange= {this.handleNumberChange}></input>
							<button>Verifier</button>
							{ this.state.verify === false ? <h2 style={{color:'red'}}>Le code est invalide !</h2> : null }
						</form>
					</>
				}
        		</div>
      		</Popup>
    	)
	}
};
