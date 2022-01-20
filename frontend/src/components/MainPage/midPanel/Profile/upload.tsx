import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/upload.css'

export default class Upload extends React.Component<{name:string},{url:null | string}>{

	constructor(props :any){
		super(props)
		this.state= {url:null};
		this.onImageUpload = this.onImageUpload.bind(this);
	}

	onImageUpload = (event:any) => {
	  if (event.target.files && event.target.files[0]) {
		let img = event.target.files[0];
		this.setState({
		  url: URL.createObjectURL(img)
		});
	  }
	};
	render(){
		return (
        <div className='uploadWidget'>
			<label htmlFor="file" className="label-file">Choisir une image</label>
			<input type="file" id="file" name="myImage" onChange={this.onImageUpload} />
		</div>
    	)
	}
};
