import React from 'react'
import axios from 'axios';


export default class Nickname extends React.Component<{login:string},{nickname:string|null}>{
	constructor(props:any)
	{
		super(props)
		this.state = {nickname:null}
	}
	async componentDidMount(){
		await axios.get("HTTP://" + window.location.host.split(":").at(0) + ":667/user/getNickname?login=" + this.props.login).then(res => {
			this.setState({nickname: res.data})
		})
	}
	render(){
		return <>{this.state.nickname && this.state.nickname}</>
	}
};
