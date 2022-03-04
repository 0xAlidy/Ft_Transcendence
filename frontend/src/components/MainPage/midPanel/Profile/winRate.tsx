import React from 'react'
import '../../../../styles/MainPage/midPanel/Profile/winRate.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class WinRate extends React.Component<{ win:number, lose:number},{}>{
    render(){
        var ratio = (Math.round((this.props.win / this.props.lose) * 100)/100);
        // if(isNaN(ratio))

        return (
        <div className="winRate">
            <div className='winItem'>
                <FontAwesomeIcon icon={solid('trophy')}/>
                <h4 className='score-win trophy'>{this.props.win}</h4>
            </div>
            <div className='winItem'>
                <FontAwesomeIcon icon={solid('skull-crossbones')}/>
                <h4 className='score-lose'>{this.props.lose}</h4>
            </div>
            <div id="ratio">Ratio <span className={ratio < 1 ? "score-lose" : "score-win"}>{ratio.toFixed(2)}</span></div>
        </div>
        )
    }
};
