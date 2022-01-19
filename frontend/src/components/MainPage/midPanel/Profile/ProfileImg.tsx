import React from 'react'
import EDIT from '../../../../assets/edit-button.png'
import CLOSE from '../../../../assets/exit.png'
import '../../../../styles/MainPage/midPanel/Profile/ProfileImg.css'
import Camera from './Camera'
export default class ProfileImg extends React.Component<{name:string},{chooseDisplay:boolean, webcamOption:boolean, fileOption:boolean}>{

	constructor(props :any){
		super(props)
		this.state= {chooseDisplay: false,
					webcamOption:false,
					fileOption:false};
		this.open = this.open.bind(this);
		this.openwebcam = this.openwebcam.bind(this)
	}

	open() {
		if(this.state.chooseDisplay === false)
			this.setState({chooseDisplay: true})
		else
			this.setState({chooseDisplay: false})
	}
	openwebcam() {
		console.log('bisous')
		if(this.state.webcamOption === false)
			this.setState({webcamOption: true})
		else
			this.setState({webcamOption: false})
	}
	handlePhoto(url:string){
		console.log(url);

	}
	render(){
		return (
        <div className='ProfileImgdiv'>
			<img src="https://cdn.intra.42.fr/users/medium_default.png" className="profileImg"/>
			<button className='ProfileButton' onClick={this.open}>
				<img src={this.state.chooseDisplay === false ? EDIT: CLOSE} alt="" width={"18px"}/>
			</button>
			{this.state.chooseDisplay === true &&
				<div className='ChooseContainer'>
					{this.state.webcamOption === false ? <div className='ChooseOption'  onClick={this.openwebcam}>use webcam</div>: <Camera name={this.props.name}/>}
					{/* <div className='ChooseOption'  onClick={this.openwebcam}>use webcam</div> */}
					<div className='ChooseOption'>upload image</div>
				</div>}
		</div>
    	)
	}
};
