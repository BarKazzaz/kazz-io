import React, {Component} from "react"

export default class LazerBeam extends Component{
    constructor(props){
        super(props);
        this.state = {
            startX: props.startX || 0,
            startY: props.startY || 0,
            endX: props.endX || 0,
            endY:props.endY || 0,
            angle: props.angle || 0
        }
    }

    getAngle(){
        //get angle in degrees https://gist.github.com/conorbuck/2606166
        return ( (Math.atan2(this.state.endY - this.state.startY, this.state.endX - this.state.startX) * 180 / Math.PI).toString() + "deg" );
    }

    getBeamLength(){
        //calculate distance between start and end points
        return Math.sqrt( Math.pow((this.state.endX - this.state.startX), 2) + Math.pow((this.state.endY - this.state.startY), 2) );
    }

    toElm = <div width={this.getBeamLength()} transform={[{ rotate: this.getAngle()}]} className={"lazerBeam"}></div>

    render(){
        return this.toElm
    }
}