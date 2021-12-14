import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/gauge.css'
export default class Gauge extends React.Component<{percent:string, lvl:string},{}>{
	constructor(props :any){
		super(props)
	}

	render(){
		return (
		<div>
			<div className="lvlGauge">
				<div className="lvl" style={{width:this.props.percent + '%'}}/>
			</div>
			{"Level :"+this.props.lvl}
		</div>
    	)
	}
};
