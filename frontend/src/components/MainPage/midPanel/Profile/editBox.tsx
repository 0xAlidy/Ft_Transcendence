import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/EditBox.css'
import EDIT from '../../../../assets/edit-button.png'
import DONE from '../../../../assets/check.png'
export default class EditBox extends React.Component<{value:string, placeHolder:string},{editMode:boolean}>{
	constructor(props :any){
		super(props)
		this.state = {editMode: false}
		this.click = this.click.bind(this);
	}

	click() {
		if (this.state.editMode)
			this.setState({editMode: false});
		else
			this.setState({editMode: true});
	}

	render(){
		return (
        <div className="editBox">
			{
				this.state.editMode === true ? <input placeholder={this.props.placeHolder} className="ProfileInput"/>: <div className="ProfileInput">{this.props.value}</div>
			}
			{
				this.state.editMode === false ? <img src={EDIT} alt="" className="editButton" onClick={this.click}/>: <img src={DONE} alt="" onClick={this.click} className="editButton"/>
			}
		</div>
    	)
	}
};