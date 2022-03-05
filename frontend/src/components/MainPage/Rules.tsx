import React from 'react'
import '../../styles/MainPage/Rules.css'

export default class Rules extends React.Component<{},{}>{
	async componentDidMount(){
		const box = document.getElementById("boxRules");
		const shadow = document.getElementById("shadow");
		const title = document.getElementById("title");
		if (box !== null && shadow !== null && title !== null)
			box.addEventListener("scroll", function() { 
				if (this.scrollTop > 47)
				{
					shadow.style.boxShadow= "0px -11px 20px 13px var(--main-color)";
					title.style.boxShadow= "none";
				}
				else
					title.style.boxShadow= "0px 16px 13px 0px hsl(0deg 0% 7%)";
			});
	};

	render(){
		return (
            <div className="midPanel" >
                <div id="RulesPanel">
                    <h1 id="title">Rules</h1>
				    <span id="shadow"></span>
				    <div id="boxRules">
                        <h2>Welcome to pong</h2>
                        <h3>Normal mode</h3>
                        <p>
                            Pong is a two-dimensional sports game that simulates table tennis.
                            <br /><br />
                            The player controls an in-game paddle by moving it vertically across the left or right side of the screen.
                            <br /><br />
                            They can compete against another player controlling a second paddle on the opposing side.
                            <br /><br />
                            Players use the paddles to hit a ball back and forth.
                            <br /><br />
                            The goal is for each player to reach eleven points before the opponent, points are earned when one fails to return the ball to the other.
                        </p>
                        <h3>Arcade mode</h3>
                        <p>
                            Same as the normal one but with additionnaly bonus. Random bonus will spawn on the center of the map if you hit them with the ball you will 
                            gain this bonus. You can, for example, hide the paddle of your opponent so he can't hit the ball.
                            <br /><br />
                            Match are ending when a player hit 5 points, then you will earn experience and a win or a defeat to your statistics
                            <br /><br />
                            To find a match click on the versus pannel and choose a game mode, or you can directly challenge another user by click on his profile shortcut
                            <br /><br />
                            enjoy
                        </p>
                    </div>
                </div>
            </div>
    	)
	}
};