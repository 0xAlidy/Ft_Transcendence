import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/EditBox.css'
import EDIT from '../../../../assets/edit-button.png'
import DONE from '../../../../assets/check.png'
export default class EditBox extends React.Component<{ value:any, onChange:any},{editMode:boolean}>{
	input: HTMLInputElement|null;
	constructor(props :any){
		super(props)
		this.state = {editMode: false}
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

	validate = () => {
		if (this.input)
			this.props.onChange(this.input.value);
		this.setState({editMode: false});
	}

	render(){
		return (
        <div className="editBox">
			{
				this.state.editMode === true ?<><input ref={this.setRef} placeholder={this.props.value} className="ProfileInput" /><img src={DONE} alt="" onClick={this.validate} className="editButton"/></>:
											  <><div className="ProfileLogin">{this.props.value}</div><img src={EDIT} alt="" className="editButton" onClick={this.click}/></>
			}
		</div>
    	)
	}
};
