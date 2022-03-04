import React from 'react'
import '../../styles/MainPage/popupStart.css'
import Popup from 'reactjs-popup';
import AvatarEditor from 'react-avatar-editor';
import EditBox from './midPanel/Profile/editBox';
import TwoAuth from './midPanel/Profile/twoAuth';
import axios from 'axios';
import profileIMG from '../../assets/profile.png'
import { User } from '../../interfaces'

export default class PopupStart extends React.Component<{ User:User, onChange:any, invite:boolean},{error:boolean, src:string|null | File,options:number, nickname:string | null, number:number | null, verify:boolean | null}>{
	editor:AvatarEditor | null;
	constructor(props :any) {
		super(props);
		this.state = {
			nickname: this.props.User.nickname,
			number: null,
			verify: null,
			error: false,
			src: null,
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
				this.setState({options:2})
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
		if (!this.props.invite)
		{
			let file = await fetch("https://cdn.intra.42.fr/users/medium_"+ this.props.User.login +".jpg")
			.then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))
			this.setState({src: file});
		}
		if (this.state.options < 2)
		{
			let page = document.getElementById("MainPage");
			if (page)
				page.classList.add("blurStart");
		}
	}

	close(){
		let page = document.getElementById("MainPage");
		if (page)
			page.classList.remove("blurStart");
	}

	render(){
		return (
			<Popup open={this.state.options < 2} closeOnDocumentClick={false} onClose={this.close}>
				<div id="popUpStart">
				{
					this.state.options === 0 && // PREMIERE CONNECTION
					<>
						<h1 id="title">Complete Profile</h1>
						<span id="shadow"></span>
						<div id="contentStart">
							<h2>Avatar</h2>
							<AvatarEditor ref={this.setEditorRef} crossOrigin='anonymous' image={this.state.src ? this.state.src : profileIMG} width={100} height={100} borderRadius={100} color={[255, 255, 255, 0.6]} scale={1.1} rotate={0}/>
							<p>Center your picture you can change it later</p>
							<h2>NickName</h2>
							<EditBox onChange={this.setName} value={this.state.nickname} User={this.props.User}/>
							<TwoAuth token={this.props.User.token}/>
							<button className='button' onClick={this.validate}>validate</button>
							{this.state.error && <p style={{color: "#cc0000"}}>Nickname error</p>}
						</div>
					</>
				}
				{
					this.state.options === 1 && // CONNECTION AVEC 2FA
					<>
						<h1>Security</h1>
						<form id="form2FA" onSubmit={this.handleSubmit}>
							<p>Two Factor Authentification is active on your account</p> 
							<label>Enter your application code to access the site</label>
							<input type="number" name="code" id="number" onChange= {this.handleNumberChange}></input>
							<button>Submit</button>
							{ this.state.verify === false ? <h2>The code is wrong</h2> : null }
						</form>
					</>
				}
        		</div>
      		</Popup>
    	)
	}
};
