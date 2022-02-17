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
		this.enable = this.enable.bind(this);
		this.disable = this.disable.bind(this);
		this.handleNumberChange= this.handleNumberChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	};

	async secretEnabled(){
		await axios.post("HTTP://" + window.location.host.split(":").at(0) + ":667/user/secretEnabled", {token: this.props.token}).then(resp =>
			this.setState({ secretEnabled: resp.data })
		);
	}

	async enable(){
		if (this.state.qr)
		{
			this.setState({
				qr: "",
				verify: null,
				number: null,
			})
		}
		else
		{
			await axios.post("HTTP://" + window.location.host.split(":").at(0) + ":667/user/generateSecret", {token: this.props.token}).then(resp =>
				this.setState({ 
					qr: resp.data,
					verify: null
				})
			);
		}
	}

	async disable(){
		if (this.state.qr)
		{
			this.setState({
				qr: "",
				verify: null,
				number: null,
			})
		}
		else
		{
			this.setState({
				qr: "true",
				verify: null
			})
		}
	}

	handleNumberChange(event:any){
		this.setState({ number: event.target.value});
	}

	async handleSubmit(event:any) {
		event.preventDefault();
		if (this.state.verify !== true)
			await axios.post("HTTP://" + window.location.host.split(":").at(0) + ":667/user/verifyNumber", {token: this.props.token, number: this.state.number}).then(resp =>
				this.setState({ verify:resp.data })
			);
		if (this.state.qr === "true" && this.state.verify === true)
		{
			await axios.post("HTTP://" + window.location.host.split(":").at(0) + ":667/user/disableSecret", {token: this.props.token}).then();
			this.setState({ 
				secretEnabled:false,
				qr: "",
				number: null,
			});
		}
		else if (this.state.qr !== "true" && this.state.verify === true)
		{
			this.setState({
				secretEnabled:true,
				qr: "",
				number: null,
			});
		}
	}

	async componentDidMount() {
        this.secretEnabled();
	}

	render(){
		return (
			<div id="twoAuth">
				<h3>Two-factor Authentication (2FA):</h3>
				{
					this.state.secretEnabled ?
					<>
						<button onClick={this.disable}>Disable 2FA</button>
						{
							this.state.qr &&
							<form onSubmit={this.handleSubmit}>
								<span>
									<label>Enter your application code :</label>
									<input type="number" name="code" id="number" onChange= {this.handleNumberChange}></input>
								</span>
								<button>Submit</button>
								{ this.state.verify === true  ? <h4 className='score-win'>The 2fa has been enabled</h4> : null}
								{ this.state.verify === false ? <h4  className='score-lose'>The code is wrong</h4> : null }
							</form>
						}
						</>
						:
						<>
						<button onClick={this.enable}>Enable 2FA</button>
						{
							this.state.qr &&
							<>
								<h3>Please scan this Qrcode on your authentication application :</h3>
								<img src={this.state.qr} alt="QrCode"/>
								<form onSubmit={this.handleSubmit}>
									<span>
										<label>Enter your application code </label>
										<input type="number" name="code" id="number" onChange= {this.handleNumberChange}></input>
									</span>
									{ this.state.verify === true ? <h4  className='score-win'>The 2fa has been disabled</h4> : null}
									{ this.state.verify === false ? <h4  className='score-lose'>The code is wrong</h4> : null }
									<button>Submit</button>
								</form>
							</>
						}
					</>
				}			
			</div>
		)
	};
};
