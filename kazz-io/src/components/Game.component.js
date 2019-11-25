import React, { Component } from 'react';
import io from "socket.io-client";
import Player from './Player.component';
const SERVER_ADDRESS = 'http://localhost:5000';

export default class Game extends Component{

    constructor(props){
        super(props);
        this.state = {
            roomName: this.props.match.params.id,
            isConnected: false,
            socket: io(SERVER_ADDRESS)
            //TODO: https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
        }
    }

    handleConnection(){
        console.log("connected");
        this.setState({isConnected: true});
    }

    componentDidMount(){
        this.state.socket.emit("join", this.state.roomName);
        this.state.socket.on("connected",this.handleConnection.bind(this));
        this.state.socket.on("ERR", (err) => { console.error(err.msg)})
    }

    renderCanvas(){
        return <canvas id="gameCanvas" width="1920px" height="970px"></canvas>;
    }

    render(){
        let res;
        if(!this.state.isConnected){
            res = <p>Pending connection...</p>
        }else{
            res = (
            <div className="kazzContainer">
                <div className="gameWrapper">
                    <h1>The Game</h1>
                    {this.renderCanvas()}
                    <Player position={[150, 100]}></Player>
                </div>
            </div>
            )
        }
        return(res);
    }
}