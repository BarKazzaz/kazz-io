import React, { Component } from 'react';
import io from "socket.io-client";
import Player from './Player.component';
const SERVER_ADDRESS = 'http://localhost:5000';

export default class Game extends Component{

    constructor(props){
        super(props);
        this.state = {
            roomName: this.props.match.params.id,
            isConnected: true,
            position: {x:0, y:0},
            socket: io(SERVER_ADDRESS)
        }
    }

    handleKeyPress(event){
        switch (event.key){
            case 'w':
            case'W':
                this.state.socket.emit("move",{room:this.state.roomName, direction:'U'});
                break;
            case 's':
            case 'S':
                this.state.socket.emit("move",{room:this.state.roomName, direction:'D'});
                break;
            case 'a':
            case 'A':
                this.state.socket.emit("move",{room:this.state.roomName, direction:'L'});
                break;
            case 'd':
            case 'D':
                this.state.socket.emit("move",{room:this.state.roomName, direction:'R'});
                break;
            default:
                console.log(event.key);
        }
    }

    componentDidMount(){
        this.state.socket.emit("join", this.state.roomName);
        this.state.socket.on("connection", (socket) => {
                console.log("connected");
                this.setState({isConnected: true});
                socket.on("ERR", (err) => { console.error(err.msg)});
                socket.on("position", pos => { this.setState({position: pos}); });
        });
        window.addEventListener('keypress', (e) => this.handleKeyPress(e));
    }

    renderCanvas(){
        return <canvas id="gameCanvas" width="1920px" height="900px"></canvas>;
    }

    renderPlayer(){
        return <Player position={this.state.position}></Player>;
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
                </div>
            </div>
            )
        }
        return(res);
    }
}