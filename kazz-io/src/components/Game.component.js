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
    
    componentDidMount(){
        this.state.socket.emit("join", this.state.roomName);
        this.state.socket.on("didJoin", (playerId, currentPlayers) => {
            this.setState({isConnected: true});
            this.setState({playerId: playerId});
            this.setState({players: currentPlayers});
            this.addPlayer(playerId);
        });

        this.state.socket.on("playerJoined", id=>{
            this.addPlayer(id);
        });

        this.state.socket.on("playerRemoved",playerId=>{ this.removePlayer(playerId) })

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
        this.state.socket.emit("removePlayer",{room:this.state.roomName,playerId:this.state.id});
    }

    addPlayer(id){
        let _players = this.state.players;
        _players[id] = {id: id, position:{x:80, y:80}, bgPositionX:0, bgPositionY:0};
        this.setState({players: _players});
    }

    removePlayer(id){
        let _players = this.state.players;
        delete _players[id];
        this.setState({players: _players});
    }

    startGame(){
        console.log("STARTING!");
        this.setState({roomState: "started"});        
    }

    toDirection(key){
        switch(key){
            case 'w':
            case 'W':
                return 'U';
            case 's':
            case 'S':
                return 'D';
            case 'a':
            case 'A':
                return 'L';
            case 'd':
            case 'D':
                    return 'R';
            default:
                return false;
        }
    }

    movePlayer(direction){
        if(this.state.lastMove === direction){ return; }
        else{
            this.state.socket.emit("move",{ room : this.state.roomName,playerId : this.state.playerId, direction : direction });
            clearInterval(this.state.movementInterval);  
            this.setState({movementInterval: 
                setInterval(() => {
                    this.state.socket.emit("move",{ room : this.state.roomName,playerId : this.state.playerId, direction : direction });
                }, 60)
            , ismoving: true, lastMove: direction});
        }
    }
    handleKeyUp(event){
        if(this.toDirection(event.key) === this.state.lastMove){
            clearInterval(this.state.movementInterval);
            this.setState({lastMove : false, ismoving : false})
        }
    }
    handleKeyPress(event){
        if(this.toDirection(event.key))
            this.movePlayer(this.toDirection(event.key));
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