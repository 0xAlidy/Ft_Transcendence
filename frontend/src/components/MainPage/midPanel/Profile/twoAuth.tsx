import React from 'react'
import axios from 'axios'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/Profile/twoAuth.css'

export default class TwoAuth extends React.Component<{token:string},{qr:string | null, number:number | null, formError: boolean | null}>{

	constructor(props:any) {
		super(props);
		this.state = { 
			qr: null,
			number: null,
			formError: null,
		};
		this.click = this.click.bind(this);
		this.handleChange= this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	};

	async click (){
		await axios.post("HTTP://localhost:667/user/generateSecret", {token: this.props.token}).then(resp =>
			this.setState({ qr: resp.data })
		);
	}

	handleChange(event:any){
		this.setState({ number: event.target.value});
	}

	async handleSubmit(event:any) {
		event.preventDefault()
		
		await axios.post("HTTP://localhost:667/user/verifyNumber", {token: this.props.token, number: this.state.number})
	}

	
	render(){
		let twoAuth;
		let message;

		/*if (this.state.formError == true)
		else if (this.state.formError == false)*/
		if (this.state.qr) {
			twoAuth =  (
				<div>
					<h2>Veuillez scanner ce Qrcode sur votre application d'authentification: </h2>
					<img src={this.state.qr} alt="QrCode" />
					<form onSubmit={this.handleSubmit}>
						<label>Saisir le code de votre application: </label>
						<input type="number" name="code" id="number" onChange= {this.handleChange}></input>
						<button>Verifier</button>
						{message}
					</form>
				</div>
    		);
  		}
		return (
				<div id="twoAuth">
					<p>Two-factor Authentication (2FA):</p>
					<button onClick={this.click}>{} 2FA</button>
					{twoAuth}
				</div>
			)
	};
};