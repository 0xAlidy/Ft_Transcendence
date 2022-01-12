import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/winRate.css'

export default class WinRate extends React.Component<{ win:number, loose:number},{}>{
    ratio:number = 80; 
    constructor(props :any){
        super(props)
    }

    render(){
        return (
        <div className="winRate">
            <div className="win"> Win : {this.props.win}</div>
            <div className="loose"> loose : {this.props.loose}</div>
            <div className="ratio"> Ratio : {this.ratio}</div>
        </div>
        )
    }
};
