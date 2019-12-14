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
            console.log(id);
            this.addPlayer(id);
        });

        this.state.socket.on("playerRemoved",playerId=>{ this.removePlayer(playerId) })

        this.state.socket.on("startGame",() => this.startGame());

        this.state.socket.on("ERR", (err) => { 
            ReactDOM.render(<div>An error has occurred:<br/> {err.msg}</div>,document.getElementById("root")); console.error(err.msg)
        });

        this.state.socket.on("position", (playerId, pos) => {
            console.log(playerId, pos)
            let _players = this.state.players;
            _players[playerId].position = pos;
            this.setState({players: _players});
        });
        window.addEventListener('keypress', (e) => this.handleKeyPress(e));
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
        _players[id] = {id: id, position:{x:80, y:80}};
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

    handleKeyPress(event){
        // if(this.state.roomState !== 'started')
        //     return;
        switch (event.key){
            case 'w':
            case'W':
                this.state.socket.emit("move",{room:this.state.roomName,playerId:this.state.playerId, direction:'U'});
                break;
            case 's':
            case 'S':
                    this.state.socket.emit("move",{room:this.state.roomName,playerId:this.state.playerId, direction:'D'});
                break;
            case 'a':
            case 'A':
                    this.state.socket.emit("move",{room:this.state.roomName,playerId:this.state.playerId, direction:'L'});
                break;
            case 'd':
            case 'D':
                    this.state.socket.emit("move",{room:this.state.roomName,playerId:this.state.playerId, direction:'R'});
                break;
            default:
                console.log(event.key);
        }
    }

    renderCanvas(){
        return <canvas id="gameCanvas" width="1920px" height="900px"></canvas>;
    }

    renderPlayers(callback){
        let positions = [];
        for (let playerId in this.state.players)
            positions.push(this.state.players[playerId].position);
        callback(positions);
    }

    callbackPlayers(positions){
        return positions.map((elm, i) => <Player key={i} position={elm}/>)
    }

    render(){
        let res;
        if(!this.state.isConnected){
            res = <p>Pending connection...</p>
        }else{
            let positions = [];
            for (let playerId in this.state.players)
                positions.push(this.state.players[playerId].position);
            let playersInRoom = this.callbackPlayers(positions);
            
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