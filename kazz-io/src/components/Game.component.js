import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from "socket.io-client";
import Player from './Player.component';
const SERVER_ADDRESS = process.env.NODE_ENV === "development" ? 'http://localhost:5000': "/";

export default class Game extends Component{

    constructor(props){
        super(props);
        this.state = {
            roomName: this.props.match.params.id,
            isConnected: false,
            players: {},
            playerId: '',
            roomState: 'waiting for players',
            movementInterval:'',
            lastMove: '',
            ismoving: false,
            socket: io(SERVER_ADDRESS)
        }
    }
    
    directions = {
        'w':'U','W':'U',
        's':'D','S':'D',
        'a':'L','A':'L',
        'd':'R','D':'R'
    }

    componentDidMount(){
        this.state.socket.emit("join", this.state.roomName);
        this.state.socket.on("didJoin", (playerId, currentPlayers) => {
            this.setState({ isConnected: true, players: currentPlayers, playerId: playerId });
        });

        this.state.socket.on("roomState", (room)=>{
            this.setState({players : room.players});
        });

        this.state.socket.on("startGame",() => this.startGame());

        this.state.socket.on("ERR", (err) => { 
            ReactDOM.render(<div>An error has occurred:<br/> {err.msg}</div>,document.getElementById("root")); console.error(err.msg)
        });

        this.state.socket.on("position", (playerId, player) => {
            let _players = this.state.players;
            _players[playerId].position = player.position;
            _players[playerId].bgPositionX = player.bgPositionX;
            _players[playerId].bgPositionY = player.bgPositionY;
            this.setState({players: _players});
        });

        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        window.addEventListener("beforeunload", (e) => {
            var confirmationMessage = "Leave?";
            (e || window.event).returnValue = confirmationMessage;
            this.state.socket.emit("removePlayer",this.state.roomName, this.state.playerId);
            return confirmationMessage;
        });
    }
    
    componentWillUnmount(){
        this.state.socket.emit("removePlayer",{room:this.state.roomName, playerId:this.state.id});
    }

    startGame(){
        console.log("STARTING!");
        this.setState({roomState: "started"});        
    }

    movePlayer(direction){
            this.state.socket.emit("move",{ room : this.state.roomName,playerId : this.state.playerId, direction : direction });
            // clearInterval(this.state.movementInterval);  
            // this.setState({movementInterval: 
            //     setInterval(() => {
            //         this.state.socket.emit("move",{ room : this.state.roomName,playerId : this.state.playerId, direction : direction });
            //     }, 60)
            // , ismoving: true, lastMove: direction});
    }

    handleKeyUp(event){
        // if(this.directions[event.key] === this.state.lastMove){
        //     clearInterval(this.state.movementInterval);
        //     this.setState({lastMove : false, ismoving : false})
        // }
    }

    handleKeyPress(event){
        // if(event.repeat) return //not supported in IE or Edge(who cares tho?)
        this.movePlayer(this.directions[event.key]);
    }

    renderCanvas(){
        return <canvas id="gameCanvas" width="1920px" height="900px"></canvas>;
    }

    renderPlayers(){
        let playersInRoom = [];
        for(let playerId in this.state.players){
            playersInRoom.push( <Player key={playerId} id={playerId} bgPositionX={this.state.players[playerId].bgPositionX} bgPositionY={this.state.players[playerId].bgPositionY} position={ this.state.players[playerId].position }/>)
        }
        return playersInRoom;
    }

    callbackPlayers(positions){
        return positions.map((elm, i) => <Player key={i} position={elm}/>)
    }

    render(){
        let res;
        if(!this.state.isConnected){
            res = <p>Pending connection...</p>
        }else{
            let playersInRoom = this.renderPlayers();
            res = (
            <div className="kazzContainer">
                <div className="gameWrapper">
                    <h1>The Game</h1>
                    {this.renderCanvas()}
                    {playersInRoom}
                </div>
            </div>
            )
        }
        return(res);
    }
}