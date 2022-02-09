import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import EDIT from '../../../../assets/edit-button.png'
import CLOSE from '../../../../assets/exit.png'
import '../../../../styles/MainPage/midPanel/Profile/ProfileImg.css'
import Camera from './Camera'
// import Upload from './upload'
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
export default class ProfileImg extends React.Component<{ User:user, refreshUser:any},{url:null|string, src:null|string, displayChoices:boolean, webcamOption:boolean, fileOption:boolean, uploadOption:boolean}>{
	editor:AvatarEditor | null;
	constructor(props :any){
		super(props)
		this.state= {displayChoices: false,
					webcamOption:false,
					fileOption:false,
					uploadOption:false,
					url:null,
					src: this.props.User.imgUrl
				};
		this.editor = null;
		this.open = this.open.bind(this);
		this.openwebcam = this.openwebcam.bind(this)
		this.onImageUpload = this.onImageUpload.bind(this);
	}

	setEditorRef = (editor: AvatarEditor) => {
		this.editor = editor;
	};

	photo = async () =>{
		var headers = {
			'Content-Type': 'application/json;charset=UTF-8',
			"Access-Control-Allow-Origin": "*"
		}
		if(this.editor){
			await fetch("HTTP://" + window.location.host.split(":").at(0) + ":667/user/upload", {
					method: "post",
					headers: headers,
					body: JSON.stringify({url:this.editor.getImageScaledToCanvas().toDataURL(), token:this.props.User.token}),
			})
			this.setState({src: this.editor.getImageScaledToCanvas().toDataURL()});
			this.setState({url: null, webcamOption: false, displayChoices: false});
			this.props.refreshUser();
		}

	}

	onImageUpload = (event:any) => {
	  if (event.target.files && event.target.files[0]) {
		let img = event.target.files[0];
		this.setState({
		  url: URL.createObjectURL(img)
		});
	  }
	};

	open() {
		if(this.state.displayChoices === false)
			this.setState({displayChoices: true})
		else
			this.setState({displayChoices: false, webcamOption: false});
	}
	openwebcam() {
		if(this.state.webcamOption === false)
			this.setState({webcamOption: true,})
		else
			this.setState({webcamOption: false})
	}

	handlePhoto(url:string){
		console.log(url);
	}

	render(){
		const validate = (url:string) =>{
			this.setState({url: url});
		}
		return (
        <div className='ProfileImgdiv'>
			{this.state.src && <img src={this.state.src} className="profileImg"/>}
			<button className='ProfileButton' onClick={this.open}>
				<img src={this.state.displayChoices === false ? EDIT: CLOSE} alt="" width={"18px"}/>
			</button>
			<div className='ChooseContainer'>
			{
				this.state.displayChoices === true &&
				<>
					{
						this.state.url === null ?
						<>
							{this.state.webcamOption  && <Camera validate={validate}/>}
							{
								!(this.state.webcamOption || this.state.uploadOption) &&
								<>
									<div className='ChooseOption'  onClick={this.openwebcam}>Use Webcam</div>
									<label className='ChooseOption' htmlFor='file'>Upload Image</label>
									<input type="file" id="file" name="myImage" accept="image/*" onChange={this.onImageUpload} />
								</>
							}
						</>:<>
							<AvatarEditor ref={this.setEditorRef} image={this.state.url as string} width={100} height={100} borderRadius={100} color={[255, 255, 255, 0.6]} scale={1.1} rotate={0}/>
							<button className='ChooseOption' onClick={this.photo}>OK</button>
						</>
					}
				</>
			}
			</div>
		</div>)
	}
};
