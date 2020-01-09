import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from "socket.io-client";
import Player from './Player.component';
import LazerBeam from './LazerBeam.component';

const SERVER_ADDRESS = process.env.NODE_ENV === "development" ? 'http://localhost:5000': "/";
const InHandler = require('./helpers/InputsHelper').InputsHandler;

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
            lazers: {},
            socket: io(SERVER_ADDRESS)
        }
        this.InputHandler = new InHandler();
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

        this.state.socket.on("roomState", (_players)=>{
            this.setState({players : _players});
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
            clearInterval(this.state.movementInterval);
            this.setState({movementInterval:
                setInterval(() => {
                    this.state.socket.emit("move",{ room : this.state.roomName,playerId : this.state.playerId, direction : direction });
                }, 60)
            , lastMove: direction});
    }

    handleKeyUp(event){
        //if it is not the same key as the last move, the interval should have been cleared already
        if(this.directions[event.key] === this.state.lastMove)
            clearInterval(this.state.movementInterval);
    }

    handleKeyPress(event){
        if(event.repeat) return //not supported in IE or Edge(who cares tho?)
        if (this.directions[event.key]){ clearInterval(this.state.movementInterval); return this.movePlayer(this.directions[event.key])} 
        if(!this.InputHandler.hasOwnProperty(event.code)) {console.log("no such:",event.code, this.InputHandler); return; }
        this.InputHandler[event.code]();//run input
    }

    mouseDownHandler(event){
        if(event.button === 0)
            this.createBeam(event.screenX, event.screenY);
    }
    createBeam(endX, endY){
        let lazerBeam = {
            key: '_' + Math.random().toString(36).substr(2, 9),
            startX: this.state.players[this.state.playerId].position.x,
            startY: this.state.players[this.state.playerId].position.y,
            endX: endX, 
            endY: endY
        }
        // eslint-disable-next-line
        this.state.lazers[lazerBeam.key] = lazerBeam;
        setTimeout(() => {
            delete this.state.lazers[lazerBeam.key];
        }, 100);
    }

    renderLazers(){
        let lazersElms = Object.values(this.state.lazers).map((e, i) =>{
            return <LazerBeam key={e.key} startX={e.startX} endX={e.endX} startY={e.startY} endY={e.endY}/>
        })
        return lazersElms;
    }

    renderCanvas(){
        return <canvas id="gameCanvas" onMouseDown={ this.mouseDownHandler.bind(this) } width="1920px" height="900px"></canvas>;
    }

    renderPlayers(){
        if(this.state.players.length < 1) return(<div></div>);
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
                    { this.renderLazers() }
                </div>
            </div>
            )
        }
        return(res);
    }
}