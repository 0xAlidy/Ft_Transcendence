import '../styles/Banner.css'
import React from 'react'
import { Link } from "react-router-dom";
import Profile from './Profile/Profile'


function Banner() {
    return (
        <div className='pong-banner'>
            
                <div className='button-profil'><Profile /></div>
                <Link to="/versus" className='pong-button'>Versus</Link>
                <Link to="/chat" className='pong-button'>Chat</Link>
                <Link to="/scoreboard" className='pong-button'>Scoreboard</Link>
                <Link to="/icon" className='pong-button'>Icon</Link>
        </div>
    )
}

export default Banner