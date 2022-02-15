import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/winRate.css'

export default class WinRate extends React.Component<{ win:number, loose:number},{}>{
    render(){
        return (
        <div className="winRate">
            <div className="win"> Win : {this.props.win}</div>
            <div className="loose"> loose : {this.props.loose}</div>
            <div className="ratio"> Ratio : {(Math.round((this.props.win / this.props.loose) * 100)/100).toFixed(2)}</div>
        </div>
        )
    }
};
