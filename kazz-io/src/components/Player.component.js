import React, { Component } from 'react';
import playerSprite from './sprites/player/player_sprite.png';

export default class Player extends Component{
    constructor(props){
        super(props);
        this.state = {
            position: props.position || [200, 200] 
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            position: props.position
        });
    }

    render(){
        console.log("x: " + this.state.position.x);
        console.log("y: " + this.state.position.y);
    
        return(
            <div
                style={{
                    position: 'absolute',
                    top: this.state.position.y,
                    left: this.state.position.x,
                    backgroundImage: `url('${playerSprite}')`,
                    backgroundPosition: '0 0',
                    width: '32px',
                    height: '38px'
                }}
            />
        );
    }
}