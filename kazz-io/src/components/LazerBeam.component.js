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
        this.setStyle = this.setStyle.bind(this);
        this.getBeamLength = this.getBeamLength.bind(this);
        this.getAngle = this.getAngle.bind(this);
    }

    getAngle(){
        //get angle in degrees https://en.wikipedia.org/wiki/Atan2
        return (Math.atan2(this.state.endY - this.state.startY, this.state.endX - this.state.startX) * 180 / Math.PI);
    }

    getBeamLength(){
        //calculate distance between start and end points
        //distance = sqrt((x1-x2)^2+(y1-y2)^2)
        return (Math.sqrt( Math.pow((this.state.endX - this.state.startX), 2) + Math.pow((this.state.endY - this.state.startY), 2) ));
    }

    setStyle(_width, _rotate){
        this.styleOfBaem = { 
            left: ((this.state.startX + 15)).toString() + "px",
            top: (this.state.startY + 15).toString() + "px",
            width: _width, height: "3px",
            transformOrigin: "left center",
            transform: `rotate(${_rotate})`
        }
    }

    render(){
        let _width = this.getBeamLength();
        let _rotate = this.getAngle().toString() + "deg";
        this.setStyle(_width, _rotate);
        return (
            <div style={this.styleOfBaem} className={"lazerBeam"}></div>
        );
    }
}