import React from 'react'
import axios from 'axios'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/Profile/twoAuth.css'

export default class TwoAuth extends React.Component<{token:string},{qr:string | null}>{

	constructor(props:any) {
		super(props);
		this.state = { qr: null };
		this.click = this.click.bind(this);
	};

	async click (){
		await axios.get("HTTP://localhost:667/user/generateSecret?token=" + this.props.token).then(resp =>
			this.setState({ qr: resp.data })
		);
	}
	
	render(){
		let img;
		if (this.state.qr) {
			img =  <img src={this.state.qr} alt="QrCode" />;
		}
	
		return (
			<div id="twoAuth">
				<p>Two-factor Authentication (2FA):</p>
				<button onClick={this.click}>{} 2FA</button>
				{img}
			</div>
    	)
	};
};