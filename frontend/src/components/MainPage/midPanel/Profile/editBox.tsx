import React from 'react'

export default class editBox extends React.Component<{value:string},{editMode:boolean}>{
	constructor(props :any){
		super(props)
		this.state= {editMode: true}
	}

	render(){
		return (
        <div className="editBox">
			{
				this.state.editMode === true ? <div>{this.props.value}</div>:<input type="text"/>
			}
		</div>
    	)
	}
};
