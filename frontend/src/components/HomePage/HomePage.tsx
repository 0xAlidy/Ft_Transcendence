import Logo from './Logo'
import React from 'react'
import '../../styles/HomePage/HomePage.css'

function HomePage(){

  function handleButtonClick(){
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=d42d44ee8052b31b332b4eb135916c028f156dbb4d3c7e277030f3b2bc08d87c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcode%2F&response_type=code';
  }
  return (
    <div id="HomePage">
      <Logo />
      <button id="loginButton" onClick={handleButtonClick}>PLAY</button>
    </div>
   )
};

export default HomePage;
