import React, { Component } from 'react';
import playerSprite from './sprites/player/player_sprite.png';

export default class Player extends Component{
    constructor(props){
        super(props);
        this.state = {
            position: props.position || [200, 200] ,
            roll: props.roll || 'SURVIVOR'
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.position !== prevProps.position)
            this.setState({ position: this.props.position })
    }

    render(){
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