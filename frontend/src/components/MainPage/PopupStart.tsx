import React from 'react'
import '../../styles/MainPage/popup.css'
import Popup from 'reactjs-popup';
import AvatarEditor from 'react-avatar-editor';
import EditBox from './midPanel/Profile/editBox';
import TwoAuth from './midPanel/Profile/twoAuth';
import axios from 'axios';
// import axios from 'axios';
interface user{
	WSId: string;
	id: number;
	imgUrl: string;
	isActive: false;
	lvl: number;
	name: string;
	nickname: string;
	numberOfLoose: number;
	numberOfWin: number;
	secret: string;
	secretEnabled: false;
	firstConnection: boolean;
	token: string;
	xp: 0;
}

export default class PopupStart extends React.Component<{ User:user, onChange:any},{ src:string | File,options:number, name:string}>{
	editor:AvatarEditor | null;
	constructor(props :any) {
		super(props);
		this.state = {
			name: this.props.User.name,
			src: "https://cdn.intra.42.fr/users/medium_"+ this.props.User.name +".jpg",
			options: this.props.User.firstConnection ? 0 : (this.props.User.secretEnabled ? 1 : 2)
		};
		this.editor = null;
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

			await axios.post('http://localhost:667/user/completeProfile',{	url:this.editor.getImageScaledToCanvas().toDataURL(),
			token:this.props.User.token,
			name:this.state.name}).then((res) => {this.props.onChange(res.data)})
		this.setState({options:3})
		}
	}

	setName = (name:string) =>{
		this.setState({name: name})
	}

	async componentDidMount(){
		let file = await fetch("https://cdn.intra.42.fr/users/medium_"+ this.props.User.name +".jpg").then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))
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
						<div style={{fontSize:'10pt'}}>
							center your picture you can change it later
						</div>
						<EditBox onChange={this.setName} value={this.state.name}/>
						<TwoAuth token={this.props.User.token}/>
						<button className='button' onClick={this.validate}>validate</button>
					</>
				}
				{
					this.state.options === 1 && // CONNECTION AVEC 2FA
					<>
					</>
				}
        		</div>
      		</Popup>
    	)
	}
};
