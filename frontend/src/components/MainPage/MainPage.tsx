import React from 'react'
import Chat from './Chat/Chat'
import IGame from './Game/Game'
import '../../styles/MainPage/MainPage.css'
import LOGO from '../../assets/logo.png'
import { io } from "socket.io-client";
import Menu from './Menu/Menu';
export const socket = io('http://' + window.location.href.split('/')[2].split(':')[0] + ':667');
const MainPage = () => {
    return (
        <div id="MainPage">
			<Chat />
			<div className="game">
				<IGame />
			</div>
				<Menu/>
			<div className="logo">
				<img src={LOGO} height="90%"/>
			</div>
			<div className="profile"></div>
		</div>
    )
};

export default MainPage;
