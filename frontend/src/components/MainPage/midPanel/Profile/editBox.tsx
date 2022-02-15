import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/EditBox.css'
import EDIT from '../../../../assets/edit-button.png'
import DONE from '../../../../assets/check.png'
import axios from 'axios'

export default class EditBox extends React.Component<{ value:any, User:any, onChange:any},{editMode:boolean, nicknameError:string | boolean}>{
	input: HTMLInputElement|null;
	constructor(props :any){
		super(props)
		this.state = {
			editMode: false,
			nicknameError: false
		}
		this.input = null;
		this.click = this.click.bind(this);
	}

	setRef = (ref:HTMLInputElement) =>{
		this.input = ref;
	}

	click() {
		if (this.state.editMode)
			this.setState({editMode: false});
		else
			this.setState({editMode: true});
	}

	validate = async () => 
	{
		var regEx = /^[0-9a-zA-Z]+$/;
		if (this.input)
		{
			if (!this.input.value.match(regEx))
				this.setState({nicknameError: "The nickname must contain only letters and numbers"});
			else if (this.input.value.length < 4)
				this.setState({nicknameError: "The nickname must contain at least 4 characters"});
			else if (this.input.value.length > 15)
				this.setState({nicknameError: "The nickname must contain a maximum of 15 characters"});
			else
			{
				let res = await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/user/nicknameAvailable?nickname=" + this.input.value)
				if (res.data === false)
					this.setState({ nicknameError: "Nickname is not available" });
				else
				{
					await axios.post("http://" + window.location.host.split(":").at(0) + ":667/user/changeNickname",{ token: this.props.User.token, nickname: this.input.value})
					this.setState({ nicknameError: true });
					if (this.input)
						this.props.onChange(this.input.value);
					this.setState({editMode: false});
				}
			}
		}
	}

	render(){
		return (
        <div className="editBox">
			<div id="editName">
				{
					this.state.editMode === true ?
					<><input ref={this.setRef} placeholder={this.props.value} className="ProfileInput" /><img src={DONE} alt="" onClick={this.validate} className="editButton"/></>
					:<><div className="ProfileLogin">{this.props.value}</div><img src={EDIT} alt="" className="editButton" onClick={this.click}/></>
				}
			</div>
			{
				this.state.nicknameError !== false && 
				(
					this.state.nicknameError === true ?
					<p className='nicknameChange'>Your nickname has been changed</p>
					: <p className='nicknameError'>{this.state.nicknameError}</p>
				)
			}
		</div>
    	)
	}
};
