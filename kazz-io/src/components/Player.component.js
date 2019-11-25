import React, { Component } from 'react';
import playerSprite from './sprites/player/player_sprite.png';

export default class Player extends Component{
    constructor(props){
        super(props);
        this.state = {
            position: props.position || [200, 200] 
        }
    }

    render(){
        return(
            <div
                style={{
                    position: 'relative',
                    top: this.state.position[1],
                    left: this.state.position[0],
                    backgroundImage: `url('${playerSprite}')`,
                    backgroundPosition: '0 0',
                    width: '40px',
                    height: '40px'
                }}
            />
        );
    }
}