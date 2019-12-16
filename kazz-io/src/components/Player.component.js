import React, { Component } from 'react';
import playerSprite from './sprites/player/player_sprite.png';

export default class Player extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: props.id,
            position: props.position || [200, 200] ,
            bgPositionX: props.bgPositionX,
            bgPositionY: props.bgPositionY,
            roll: props.roll || 'SURVIVOR'
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.position !== prevProps.position)
            this.setState({ position: this.props.position })
        if(this.props.bgPositionX !== prevProps.bgPositionX){
            this.setState({ bgPositionX : this.props.bgPositionX });
        }
        if(this.props.bgPositionY !== prevProps.bgPositionY){
            this.setState({ bgPositionY : this.props.bgPositionY });
        }
    }

    animateWalk(direction){
        switch(direction){
            case "U":
                this.setState({ bgPositionY : 73 });
                break;
            case "D":
                this.setState({ bgPositionY : 0 });
                break;
            case "L":
                this.setState({ bgPositionY : 37 });
                break;
            case "R":
                this.setState({ bgPositionY : 108 });
                break;
            default:
                break;
        }
        this.setState({ bgPositionX : (this.state.bgPositionX + 32) % 64 });
    }

    renderCharacter(){
        return(<div className="character" id={this.state.id}
                style={{
                    position: 'absolute',
                    top: this.state.position.y,
                    left: this.state.position.x,
                    backgroundImage: `url('${playerSprite}')`,
                    backgroundPosition: this.state.bgPositionX.toString()+'px '+this.state.bgPositionY.toString()+'px',
                    width: '32px',
                    height: '37px'
                }}
        />)
    }

    render(){
        return( this.renderCharacter() );
    }
}