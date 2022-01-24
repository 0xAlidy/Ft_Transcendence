// import axios from "axios";
import React from "react";
import Webcam from "react-webcam";
// import AvatarEditor from 'react-avatar-editor'
import '../../../../styles/MainPage/midPanel/Profile/camera.css'

const videoConstraints = {
width: 150,
height:100,
facingMode: "environment"
};

export default class Camera extends React.Component<{validate:any},{url:string | null}>{
	webcam:Webcam | null;
	constructor(props :any){
		super(props)
		this.state= {url: null};
		this.webcam = null;
	}

	setRef = (webcam: Webcam) => {
		this.webcam = webcam;
	};
	capturePhoto = () => {
	var imgSrc: any;
	if(this.webcam){
		imgSrc = this.webcam.getScreenshot();}
		this.setState({url:imgSrc});
	};
// validate(){
// }
render(){
	const good = () => {
		// var imageURL;
			// var headers = {
			// 	'Content-Type': 'application/json;charset=UTF-8',
			// 	"Access-Control-Allow-Origin": "*"
			// }
			console.log(this.state.url);
			// axios.post('HTTP://localhost:667/user/upload', {url:this.state.url, name:this.props.name},{headers:headers})
			this.props.validate(this.state.url);
			this.setState({url: null});
			// fetch('HTTP://localhost:667/user/upload', {
			// 	method: "post",
			// 	headers: headers,
			// 	body: JSON.stringify({url:this.editor.getImageScaledToCanvas().toDataURL(), name:this.props.name}),
			// })
	}
return (
	<div className="cameraWidget">
		{this.state.url === null ?
		<>
			<div style={{height:'10px'}}/>
			<Webcam className="webcam" ref={this.setRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} />
		</>:
		<>
			<div style={{height:'10px'}}/>
			<img src={this.state.url}/>
		</>}
		{this.state.url === null ?
			<button className='buttonCapture' onClick={this.capturePhoto}>[o]</button>
		:<>
			<button className='buttonCapture' onClick={() => this.setState({url:null})}>Retry</button>
			<button className='buttonCapture' onClick={good}>validate</button>
		</>}
	</div>
);
}
};
