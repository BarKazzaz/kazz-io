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
            position: {x:0, y:0},
            socket: io(SERVER_ADDRESS)
        }
    }

    handleConnection(){
        console.log("connected");
        this.setState({isConnected: true});
    }

    handleKeyPress(event){
        switch (event.key){
            case 'w':
            case'W':
                this.state.socket.emit("move",'U');
                break;
            case 's':
            case 'S':
                this.state.socket.emit("move",'D');
                break;
            case 'a':
            case 'A':
                this.state.socket.emit("move",'L');
                break;
            case 'd':
            case 'D':
                this.state.socket.emit("move",'R');
                break;
            default:
                console.log(event.key);
        }
    }

    componentDidMount(){
        this.state.socket.emit("join", this.state.roomName);
        this.state.socket.on("connected",this.handleConnection.bind(this));
        this.state.socket.on("ERR", (err) => { console.error(err.msg)});
        this.state.socket.on("position", pos => { this.setState({position: pos}); });
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
                    {this.renderPlayer()}
                </div>
            </div>
            )
        }
        return(res);
    }
}