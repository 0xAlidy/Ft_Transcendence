import React from "react";
import Logo from "./Logo";

export default class TwoDivs extends React.Component {
	state = {
	  div1Shown: true,
	}

	handleButtonClick() {
	  this.setState({
		div1Shown: false,
	  });
	}

	render() {

	  return (
		<div>
		  {
		  this.state.div1Shown ?
			 (<Logo />)
			 : (<iframe src="https://api.intra.42.fr/oauth/authorize?client_id=d42d44ee8052b31b332b4eb135916c028f156dbb4d3c7e277030f3b2bc08d87c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2F&response_type=code" className="iframe" style={{zIndex:"0"}} width="300px" height="400px"></iframe>)
		  }
		</div>
	  );
	}
  }
