import React from 'react'
import '../../styles/MainPage/popupStart.css'
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

export default class PopupStart extends React.Component<{ User:user, onChange:any},{error:boolean, src:string | File,options:number, nickname:string | null, number:number | null, verify:boolean | null}>{
	editor:AvatarEditor | null;
	constructor(props :any) {
		super(props);
		this.state = {
			nickname: this.props.User.nickname,
			number: null,
			verify: null,
			error: false,
			src: "https://cdn.intra.42.fr/users/medium_"+ this.props.User.login +".jpg",
			options: this.props.User.firstConnection ? 0 : (this.props.User.secretEnabled ? 1 : 2)
		};
		this.editor = null;
		this.handleNumberChange= this.handleNumberChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setName = this.setName.bind(this);
		this.setEditorRef = this.setEditorRef.bind(this);
		this.validate = this.validate.bind(this);
	}

	setEditorRef(editor: AvatarEditor){
		this.editor = editor;
	};

	setName(nickname:string){
		this.setState({ nickname: nickname });
	};

	handleNumberChange(event:any){
		this.setState({ number: event.target.value });
	};

	async validate(){
		if (this.editor){
			if (this.state.nickname)
			{
				await axios.post("http://" + window.location.host.split(":").at(0) + ":667/user/completeProfile",{	url:this.editor.getImageScaledToCanvas().toDataURL(),
				token:this.props.User.token,
				nickname:this.state.nickname}).then((res) => {this.props.onChange(res.data)})
				this.setState({options:3})
			}
			else
			{
				this.setState({ error:true });
			}
		}
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
		let file = await fetch("https://cdn.intra.42.fr/users/medium_"+ this.props.User.login +".jpg").then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))
		this.setState({src: file});

		const box = document.getElementById("contentStart");
		const shadow = document.getElementById("shadow");
		const title = document.getElementById("title");
		if (box !== null && shadow !== null && title !== null)
			box.addEventListener("scroll", function() { 
				if (this.scrollTop > 5)
				{
					shadow.style.boxShadow= "0px -11px 20px 13px #fee154";
					title.style.boxShadow= "none";
				}
				else
					title.style.boxShadow= "0px 16px 13px 0px hsl(0deg 0% 7%)";
			});
	}

	render(){
		return (
			<Popup open={this.state.options < 2} closeOnDocumentClick={false} >
				<div id="popUpStart">
				{
					this.state.options === 0 && // PREMIERE CONNECTION
					<>
						<h1 id="title">Complete Profile</h1>
						<span id="shadow"></span>
						<div id="contentStart">
							<h2>Avatar</h2>
							<AvatarEditor ref={this.setEditorRef} crossOrigin='anonymous' image={this.state.src} width={100} height={100} borderRadius={100} color={[255, 255, 255, 0.6]} scale={1.1} rotate={0}/>
							<p>Center your picture you can change it later</p>
							<h2>NickName</h2>
							<EditBox onChange={this.setName} value={this.state.nickname} User={this.props.User}/>
							<TwoAuth token={this.props.User.token}/>
							<button className='button' onClick={this.validate}>validate</button>
							{this.state.error && <p>Nickname error</p>}
						</div>
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
