import React, { Component } from 'react';
import io from "socket.io-client";
const SERVER_ADDRESS = 'http://localhost:5000';

export default class Game extends Component{

    constructor(props){
        super(props);
        this.state = {
            roomName: this.props.match.params.id,
            socket: io(SERVER_ADDRESS)
            //TODO: https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
        }
    }
    componentDidMount(){
        this.state.socket.on("position",(pos) => {
            console.log(pos);
        })
    }

    renderCanvas(){
        return <canvas id="gameCanvas" width="1920px" height="1080px"></canvas>;
    }

    render(){
        return(
            <div className="kazzContainer">
                <div className="gameWrapper">
                    <h1>The Game</h1>
                    {this.renderCanvas()}
                </div>
            </div>
        );
    }
}