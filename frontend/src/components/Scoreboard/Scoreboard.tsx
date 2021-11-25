import React from 'react'
import "../../styles/Scoreboard.css"


function Scoreboard(props:any) {
    return (
        <div className='scoreboard-body'>
            <div className='scoreboard'>
            <div className='scoreboard-external-body'>
                <div className='scoreboard-text'>Scoreboard</div>
                <div className='scoreboard-separate' />
            </div>
            <div className='scoreboard-internal-body'>
                <div className='scoreboard-border'>Add 10 friend</div>
                <div className='scoreboard-border'>10 wins in a row</div>
                <div className='scoreboard-border'>Perfect score</div>
                <div className='scoreboard-border'>Hidden success</div>
                <div className="scoreboard-vertical-separate" />
                <div className='scoreboard-border'>Create a chan</div>
                <div className='scoreboard-border'>42 loses in a row</div>
                <div className='scoreboard-border'>Reach the top 10</div>
                <div className='scoreboard-border'>Hidden success</div>
            </div>
            </div>
        </div>	
    )	
}

export default Scoreboard