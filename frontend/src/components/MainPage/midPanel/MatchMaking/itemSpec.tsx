import * as React from "react";
import ProfileShortCut from "../../ProfileShortcut";

interface specRoomsData{
	name:string,
	left:string,
	right:string,
}
export default class ItemSpec extends React.Component<{data:specRoomsData, token:string},{}>{
	constructor(props:any) {
		super(props)
	};
	render(){
		return	(<div className="itemSpec">
					<div className="grid">
						<div className="imgLeft">
								<ProfileShortCut canOpen={true} pseudo={this.props.data.left} token={this.props.token}/>
						</div>
						<div className="imgRight">
								<ProfileShortCut canOpen={true} pseudo={this.props.data.right} token={this.props.token}/>
						</div>
						<div className="text">VS</div>
						<div className="nameLeft">
							{this.props.data.left}
						</div>
						<div className="nameRight">
							{this.props.data.right}
						</div>
						<div className="specButtongrid">
							<button className="specButton">Spectate</button>
						</div>
					</div>
				</div>)
	}
}
