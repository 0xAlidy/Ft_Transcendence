import Banner from './components/Banner'
import Homepage from './components/Homepage/Homepage'
import OnlineGame from './components/Versus/OnlineGame'
import LocalGame from './components/Versus/LocalGame'
import Chat from './components/Chat/Chat'
import Scoreboard from './components/Scoreboard/Scoreboard'
import Icon from './components/Icon/Icon'
//import Pannel from './components/Pannel'
//import Footer from './components/Footer'
//import ShoppingList from './components/ShoppingList'
import './styles/Layout.css'
import './styles/Body.css'
import './App.css'
//import axios from 'axios'
import React from 'react';
import Auth from './components/auth/auth'
import { Route, Switch} from "react-router-dom";
import IGame from './components/game/Game'
import Logo from './components/Homepage/Logo'


function App() {
		return (
			<Switch>
				<Route exact path="/">
						<Homepage />
				</Route>
				<Route exact path="/game">
						<IGame />
				</Route>
				<Route exact path="/dev" >
					<div className="grid">
						<Chat />
						<div className="game">
							<IGame />
						</div>
						<div className="menu"></div>
						<div className="logo"></div>
						<div className="profile"></div>
					</div>
				</Route>
			</Switch>
		)
}

					{/* <Banner />
					<Route path="/auth" component={Auth} />
						<div className="horizontal">
							<div className="limit">

							</div>
					</div>*/}
export default App
