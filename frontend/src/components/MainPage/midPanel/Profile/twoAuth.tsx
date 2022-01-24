import React from 'react'
import axios from 'axios'
import '../../../../styles/MainPage/midPanel/midPanel.css'
import '../../../../styles/MainPage/midPanel/Profile/twoAuth.css'

export default class TwoAuth extends React.Component<{token:string},{secretEnabled:boolean, qr:string, number:number | null, verify:boolean | null}>{

	constructor(props:any) {
		super(props);
		this.state = {
			secretEnabled: false,
			qr: "",
			number: null,
			verify: null,
		};
		this.secretEnabled = this.secretEnabled.bind(this);
		this.click = this.click.bind(this);
		this.handleNumberChange= this.handleNumberChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	};

	async secretEnabled(){
		await axios.post("HTTP://localhost:667/user/secretEnabled", {token: this.props.token}).then(resp =>
				this.setState({ secretEnabled: resp.data })
			);
	}

	async click(){
		if (!this.state.qr)
		{
			await axios.post("HTTP://localhost:667/user/generateSecret", {token: this.props.token}).then(resp =>
				this.setState({ qr: resp.data })
			);
		}
	}

	handleNumberChange(event:any){
		this.setState({ number: event.target.value});
	}

	async handleSubmit(event:any) {
		event.preventDefault();
		await axios.post("HTTP://localhost:667/user/verifyNumber", {token: this.props.token, number: this.state.number}).then(resp =>
			this.setState({ verify:resp.data })
		);
	}


	render(){
		// Check secretEnabled
		this.secretEnabled();
		return (
			<div id="twoAuth">
				<p>Two-factor Authentication (2FA):</p>
				{
					this.state.secretEnabled ?
						<p>Deja activé</p>
					:
					<>
						<button onClick={this.click}>activate 2FA </button>
						{
							this.state.qr &&
							<div>
								<h2>Veuillez scanner ce Qrcode sur votre application d'authentification: </h2>
								<img src={this.state.qr} alt="QrCode" />
								<form onSubmit={this.handleSubmit}>
									<label>Saisir le code de votre application: </label>
									<input type="number" name="code" id="number" onChange= {this.handleNumberChange}></input>
									<button>Verifier</button>
									{ this.state.verify === true ? <h2 style={{color:'green'}}>Bravo l'auth est active !</h2> : null }
									{ this.state.verify === false ? <h2 style={{color:'red'}}>Le code est invalide !</h2> : null }
								</form>
							</div>
						}
					</>
				}
			</div>
		)
	};
};
