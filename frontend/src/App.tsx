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


function App() {
		return (
			<div >
					<Banner />
					<Route path="/auth" component={Auth} />
					<Route exact path="/dev" >
							<Chat />
							<IGame />
					</Route>
					{/* <Route exact path="/versus/local-game">
						<LocalGame />
					</Route>
					<Route exact path="/versus/online-game">
						<OnlineGame />
					</Route> 
					 <Route exact path="/chat">
						<Chat />
					</Route>
					<Route exact path="/scoreboard">
						<Scoreboard />
					</Route>
					<Route exact path="/icon">
						<Icon />
		</Route>*/}
					<Route exact path="/" component={Homepage}/>
				</div>
		)
}

export default App
