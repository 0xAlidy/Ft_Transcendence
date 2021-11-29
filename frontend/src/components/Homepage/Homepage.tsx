import Logo from './Logo'
import React from 'react'
import '../../styles/Homepage/Homepage.css'

const Homepage = () => {
  
  function handleButtonClick(){
    console.log("HIT");
        /*this.setState({
          div1Shown: false,
        });
        if (this.state.div1Shown)
          (document.getElementById('item') as HTMLElement).style.marginTop = '5%';
        else
          (document.getElementById('item') as HTMLElement).style.marginTop = '25%';*/
  }

  return (
    <div id="Homepage">
      <Logo />
      <button id="loginButton" onClick={handleButtonClick}>PLAY</button>
    </div>
   )
};

export default Homepage;
