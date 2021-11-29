import { Route, Switch, Redirect } from "react-router-dom"
import Homepage from './components/HomePage/HomePage'
import MainPage from './components/MainPage/MainPage'
import React, {useState} from 'react'



function App() {
	const [isConnect, setIsConnect] = useState(false);
	return (
		<Switch>
			<Route exact path="/">
				{ isConnect ? <MainPage />: <Homepage setIsConnect={setIsConnect}/> }
			</Route>
			<Route render={() => <Redirect to={{pathname: "/"}} />} />
		</Switch>
	)
}

export default App
