import React from 'react'
import Chat from './Chat/Chat'
import IGame from './Game/Game'
import '../../styles/MainPage/MainPage.css'

const MainPage = () => {
    return (
        <div id="MainPage">
			<Chat />
			<div className="game">
				<IGame />
			</div>
			<div className="menu"></div>
			<div className="logo"></div>
			<div className="profile"></div>
		</div>
    )
};

export default MainPage;