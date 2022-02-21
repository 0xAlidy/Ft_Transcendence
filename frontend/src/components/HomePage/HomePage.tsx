import Logo from './Logo'
import React from 'react'
import '../../styles/HomePage/HomePage.css'

function HomePage(){
                          
  function handleButtonClick(){
    var id = "552b0c33e721d8fe183bb2dfa4d53df2e93915fe79f46596d8afe9f264b6378b";
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=' + id + '&redirect_uri=http%3A%2F%2F'+ window.location.host.split(":").at(0) + '%3A667%2Fauth%2Fredirect&response_type=code';
  }

  return (
    <div id="HomePage">
      <Logo />
      <button id="loginButton" onClick={handleButtonClick}>PLAY</button>
    </div>
   )
};

export default HomePage;
