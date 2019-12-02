import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from "socket.io-client";
import Player from './Player.component';
const SERVER_ADDRESS = 'http://localhost:5000';

export default class Game extends Component{

    constructor(props){
        super(props);
        this.state = {
            roomName: this.props.match.params.id,
            isConnected: false,
            players: [],
            playerId: '',
            socket: io(SERVER_ADDRESS)
        }
    }

    componentWillUnmount(){
        this.state.socket.emit("removePlayer",{room:this.state.roomName,playerId:this.state.id});
    }

    componentDidMount(){
        this.state.socket.emit("join", this.state.roomName);
        this.state.socket.on("didJoin", (playerId) => {
            this.setState({isConnected: true});
            this.setState({playerId: playerId});
            console.log("you are: ", playerId);
        });
        this.state.socket.on("playerJoined", id=>{
            console.log(id);
        })
        this.state.socket.on("ERR", (err) => { 
            ReactDOM.render(<div>An error has occurred:<br/> {err.msg}</div>,document.getElementById("root")); console.error(err.msg)
        });
        this.state.socket.on("position", pos => { this.setState({position: pos}); });
        window.addEventListener('keypress', (e) => this.handleKeyPress(e));
        window.addEventListener("beforeunload", (e) => {
            var confirmationMessage = "Leave?";
            (e || window.event).returnValue = confirmationMessage;
            this.state.socket.emit("removePlayer",this.state.roomName, this.state.playerId);
            return confirmationMessage;
        });
    }

    renderCanvas(){
        return <canvas id="gameCanvas" width="1920px" height="900px"></canvas>;
    }

    renderPlayer(){
        return <Player position={this.state.position}></Player>;
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