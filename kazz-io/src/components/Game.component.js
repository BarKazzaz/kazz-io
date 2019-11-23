import React, { Component } from 'react';
import openSocket from "socket.io-client";
const SERVER_ADDRESS = 'http://localhost:5001';

export default class Game extends Component{
    
    constructor(){
        super();
        this.state = {
            socket = openSocket(SERVER_ADDRESS)//TODO: https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
        }
    }

    render(){
        return(
            <div className="kazzContainer">
                <div className="gameWrapper">
                    <h1>The Game</h1>
                    <canvas 
                        id="gameCanvas"
                        width="680"
                        height="420">
                    </canvas>
                </div>
            </div>
        );
    }
}