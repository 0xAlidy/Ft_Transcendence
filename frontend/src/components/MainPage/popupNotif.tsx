import React from 'react';
import Popup from 'reactjs-popup';
import { Socket } from 'socket.io-client';
import { User } from '../../interfaces';
import ProfileShortCut from "./ProfileShortcut";
import '../../styles/MainPage/popupNotif.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore 
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

interface popupInfo {
    win:boolean,
    adv:string,
    arcade:boolean,
    scoreLose:number
}

export default class PopupNotif extends React.Component<{socket:Socket, User:User}, {popupInfo:popupInfo|null}>
{
    constructor(props :any) {
		super(props);
		this.state = {
			popupInfo:null,
		};
	}

    componentDidMount(){
        this.props.socket.on('popupScore', (data:any) => {
            this.setState({popupInfo:{win:data.win, adv:data.adv, arcade:data.arcade, scoreLose: data.scoreLose}})
        });
    }

    open = async () => {
		let page = document.getElementById("MainPage");
		if (page)
			page.classList.add("blur");
	}

	close = () => {
		let page = document.getElementById("MainPage");
		if (page)
			page.classList.remove("blur");
            this.setState({popupInfo:null})
	}

    render(){
        return (
            <Popup open={this.state.popupInfo ? true : false} closeOnEscape={false}  closeOnDocumentClick={true} onOpen={this.open} onClose={this.close} >
                {
                    this.state.popupInfo &&
                    <div className='popupNotif'>
                        {
                            this.state.popupInfo.win ? 
                            <FontAwesomeIcon className="iconNotif" icon={solid('trophy')}/>
                            :
                            <FontAwesomeIcon className="iconNotif" icon={solid('skull-crossbones')}/>
                        }
                        {
                            this.state.popupInfo.arcade ?
                            <FontAwesomeIcon className="iconNotif" icon={solid('hat-wizard')}/>
                            :
                            <FontAwesomeIcon className="iconNotif" icon={solid('hand-fist')}/>
                        }
                        <ProfileShortCut login={this.state.popupInfo.adv} User={this.props.User} socket={this.props.socket} />
                        <h3> 5 / {this.state.popupInfo.scoreLose}</h3>
                    </div>
                }
            </Popup>
        )
    }
}