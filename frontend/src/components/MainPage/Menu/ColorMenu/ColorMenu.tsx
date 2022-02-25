import React from 'react'
import '../../../../styles/MainPage/menu/ColorMenu/ColorMenu.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore 
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class ColorMenu extends React.Component<{token:string}, {color:Array<string>, save:string|null}>
{
    constructor(props :any) {
		super(props);
		this.state = {
			color: ["#00f8ff", "#73ff00", "#a400ff", "#cc0000", "#fee154", "#f3f3f3"],
            save: null,
		};
    }

    handleClickMenu(){
        let menu = document.querySelector(".ColorMenu");
        if (menu)
            menu.classList.toggle('active')
    }

    testColor(index:number)
    {
        this.setState({save: document.documentElement.style.getPropertyValue('--main-color')});
        let active = document.querySelector(".active");
        if (active)
        {
            document.documentElement.style.setProperty('--main-color', this.state.color[index]);
        }
    }

    resetColor()
    {
        let active = document.querySelector(".active");
        if (active)
        {
            document.documentElement.style.setProperty('--main-color', this.state.save);
        }
    }

    async changeColor(index:number)
    {
        this.setState({save: document.documentElement.style.getPropertyValue('--main-color')}, async () =>{
            await axios.post("HTTP://" + window.location.host.split(":").at(0) + ":667/user/setColor", {token: this.props.token, color: this.state.save}).then();
        } );
    }

    generateIndex(i:number){
        const style = {
           "--i": i,
        }  as React.CSSProperties
        return style
    }

    async componentDidMount() {

    }

    render(){
        return (
            <div id="ColorMenuBox">
                <div className="ColorMenu">
                    <div className='toggle' onClick={this.handleClickMenu}>
                        <FontAwesomeIcon icon={solid('brush')}/>
                    </div>
                    <li style={this.generateIndex(0)}  onMouseEnter={() => this.testColor(0)} onMouseLeave = {() => this.resetColor()} onMouseDown = {() => this.changeColor(0)} >
                        <FontAwesomeIcon className="colorIcon" id="color0" icon={solid('droplet')}/>
                    </li>
                    <li style={this.generateIndex(1)} onMouseEnter={() =>this.testColor(1)} onMouseLeave = {() => this.resetColor()} onMouseDown = {() => this.changeColor(1)} >
                        <FontAwesomeIcon className="colorIcon" id="color1" icon={solid('droplet')}/>
                    </li>
                    <li style={this.generateIndex(2)} onMouseEnter={() =>this.testColor(2)} onMouseLeave = {() => this.resetColor()} onMouseDown = {() => this.changeColor(2)} >
                        <FontAwesomeIcon className="colorIcon" id="color2" icon={solid('droplet')}/>
                    </li>
                    <li style={this.generateIndex(3)} onMouseEnter={() =>this.testColor(3)} onMouseLeave = {() => this.resetColor()} onMouseDown = {() => this.changeColor(3)} >
                        <FontAwesomeIcon className="colorIcon" id="color3" icon={solid('droplet')}/>
                    </li>
                    <li style={this.generateIndex(4)} onMouseEnter={() =>this.testColor(4)} onMouseLeave = {() => this.resetColor()} onMouseDown = {() => this.changeColor(4)} >
                        <FontAwesomeIcon className="colorIcon" id="color4" icon={solid('droplet')}/>
                    </li>
                    <li style={this.generateIndex(5)} onMouseEnter={() => this.testColor(5)} onMouseLeave = {() => this.resetColor()} onMouseDown = {() => this.changeColor(5)} >
                        <FontAwesomeIcon className="colorIcon" id="color5" icon={solid('droplet')}/>
                    </li>
                </div>
            </div>
        )
    }
}