//import Game from './Game'
import React from 'react'
import "../../styles/Versus.css"
import { Link } from "react-router-dom";
import versusonline from "../../assets/versus1.svg"
import versusfriend from "../../assets/versusfriend1.svg"
import SearchBar from "./SearchBar"
import FriendCode from "./FriendCode"

function Versus(props:any) {
    return (
        <div className='versus-body'>
            <div className='versus'>
                <div>Multiplayer</div>
                <Link to="/versus/online-game" className='versus-online-button'><img src={versusonline} alt="" /></Link>
                <div>Join a friend :
                <SearchBar />
                </div>
                <div className='versus-separate' />
                <div>Invite a friend</div>
                <Link to="/versus/local-game" className='versus-friend-button'><img src={versusfriend} alt="" /></Link>
                <div>Friend's code :
                <FriendCode />
                </div>
                
            </div>
        </div>
    )	
}

export default Versus