import Logo from './Logo'
import React from 'react'
import '../../styles/HomePage/HomePage.css'

interface HomePageProps {
  setIsConnect(value:boolean):void;
}
const Homepage = (props:HomePageProps) => {
  
  function handleButtonClick(){
    props.setIsConnect(true);
  }

  return (
    <div id="HomePage">
      <Logo />
      <button id="loginButton" onClick={handleButtonClick}>PLAY</button>
    </div>
   )
};

export default Homepage;
