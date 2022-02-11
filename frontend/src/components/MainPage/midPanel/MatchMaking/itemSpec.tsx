import * as React from "react";
import '../../../../../styles/MainPage/midPanel/History/History.css'
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
						<ProfileShortCut canOpen={true} pseudo={this.props.data.left} token={this.props.token} />
						<ProfileShortCut canOpen={true} pseudo={this.props.data.left} token={this.props.token}/>
				</div>)
	}
};
