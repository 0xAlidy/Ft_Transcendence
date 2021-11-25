import React from "react";
import "../../styles/Icon.css"
import "../../styles/FileUploaded.css"
import sun from '../../assets/sun.png'
import deadpool from '../../assets/deadpool.png'
import donkeykong from '../../assets/donkeykong.png'
import mickey from '../../assets/mickey.png'
import sorcerer_hat from '../../assets/sorcerer_hat.png'
import trunks from '../../assets/trunks.png'
import download from '../../assets/download.svg'
import FileUploaded from './FileUploaded'

function Icon(props:any) {
    
    return (
        
        <div className='icon-body'>
            <div className='icon'>
                <div className='icon-text'>Icon</div>
                <div className='icon-separate' />
                <div className='icon-choice'>
                    <div><img src={sun} width="85" height="85" alt="" /><button className='icon-choose'>choose</button></div> 
                    <div><img src={deadpool} width="85" height="85" alt="" /><button className='icon-choose'>choose</button></div> 
                    <div><img src={donkeykong} width="85" height="85" alt="" /><button className='icon-choose'>choose</button></div> 
                    <div><img src={mickey} width="85" height="85" alt="" /><button className='icon-choose'>choose</button></div> 
                    <div><img src={sorcerer_hat} width="85" height="85" alt="" /><button className='icon-choose'>choose</button></div> 
                    <div><img src={trunks} width="85" height="85" alt="" /><button className='icon-choose'>choose</button></div> 
                </div>
                <form>
                    <div className='icon-import'><img src={download} width="85" height="85" alt="" />
                    <FileUploaded />
                    </div>
               </form>
            </div>
        </div>	
    )	
}

export default Icon