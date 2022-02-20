import React from 'react'
import '../../../../styles/MainPage/menu/ColorMenu/ColorMenu.css'

export default class ColorMenu extends React.Component<{}>
{
    constructor(props :any) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        let menu = document.getElementById("ColorMenu");
        if (menu)
            menu.classList.toggle('active')
    }

    async componentDidMount() {

    }

    render(){
        return (
            <div id="ColorMenuBox">
                <div id ="ColorMenu" onClick={this.handleClick}>

                </div>
            </div>
        )
    }
}