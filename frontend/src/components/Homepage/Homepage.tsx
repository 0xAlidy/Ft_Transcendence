import Logo from './Logo'
import React from 'react'

function Homepage() {
    return (
        <div className="logo">
            <Logo/>
            <a  className="link" href="https://api.intra.42.fr/oauth/authorize?client_id=d42d44ee8052b31b332b4eb135916c028f156dbb4d3c7e277030f3b2bc08d87c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2F&response_type=code">\
                <button className="loginButton">PLAY
                </button>
            </a>
        </div>
        )
}

export default Homepage
