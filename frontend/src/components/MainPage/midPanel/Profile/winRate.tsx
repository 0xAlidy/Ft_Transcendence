import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/winRate.css'

export default class WinRate extends React.Component<{ win:number, loose:number},{}>{
    render(){
        return (
        <div className="winRate">
            <div id="win" className='score-win'>Win : {this.props.win}</div>
            <div id="loose" className='score-lose'>Lose : {this.props.loose}</div>
            <div id="ratio"> Ratio : {(Math.round((this.props.win / this.props.loose) * 100)/100).toFixed(2)}</div>
        </div>
        )
    }
};
