import { Route, Switch, Redirect } from "react-router-dom"
import HomePage from './components/HomePage/HomePage'
import MainPage from './components/MainPage/MainPage'
import React, {useState} from 'react'
import Auth from "./components/HomePage/Auth/Auth";


function App() {
	const [isConnect, setIsConnect] = useState(false);
	return (
		<Switch>
			<Route exact path="/code">
				<Auth/>
			</Route>
			<Route exact path="/">
				{ isConnect ? <MainPage />: <HomePage setIsConnect={setIsConnect}/> }
			</Route>
			<Route render={() => <Redirect to={{pathname: "/"}} />} />
		</Switch>
	)
}

export default App
