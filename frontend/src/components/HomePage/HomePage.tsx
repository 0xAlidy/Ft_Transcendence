import Logo from './Logo'
import React from 'react'
import '../../styles/HomePage/HomePage.css'

function HomePage(){
                          
  function handleButtonClick(){
    var id = "f8d90302a7cbd7aad44c9c38c89d012b978c5a4555b85aa6a18f683fabcc3c47";
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
