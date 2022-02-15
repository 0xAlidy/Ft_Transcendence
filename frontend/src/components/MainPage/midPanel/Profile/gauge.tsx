import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/gauge.css'
export default class Gauge extends React.Component<{percent:string, lvl:string},{}>{
	render(){
		return (
		<>
			<div className="lvlT"> {this.props.lvl}</div>
			<div className="lvlGauge">
				<div className="lvlG" style={{width:this.props.percent + '%'}}/>
			</div>
		</>
    	)
	}
};
