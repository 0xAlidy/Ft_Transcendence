import { Route, Switch, Redirect } from "react-router-dom"
import HomePage from './components/HomePage/HomePage'
import MainPage from './components/MainPage/MainPage'
import React, {useState} from 'react'
import { useLocation } from 'react-router';
import Auth from "./components/HomePage/Auth/Auth";


function App() {
	const [isConnect, setIsConnect] = useState(false);
	const [token, setToken] = useState("null") // remplacer le token de l'intra par le notre (jwt) cote back
	const [name, setName] = useState("null") // remplacer le token de l'intra par le notre (jwt) cote back

	return (
		<Switch>
			<Route path="/auth">
				<Auth  token={setToken} name={setName} connect={setIsConnect} location={useLocation().search}/>
			</Route>
			<Route exact path="/">
				{ isConnect ? <MainPage name={name} token={token}/>: <HomePage/> }
			</Route>
			<Route render={() => <Redirect to={{pathname: "/"}} />} />
		</Switch>
	)
}

export default App
