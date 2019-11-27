import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import io from "socket.io-client";
import logo from '../logo.svg';

const SERVER_ADDRESS = 'http://localhost:5000';


export default class MainMenu extends Component{

    constructor(props){
        super(props);
        this.showOnclick = this.showOnclick.bind(this);
        this.state = {
            joinRoomBtn: "",
            createRoomBtn: "",
            roomsList: [],
            socket: io(SERVER_ADDRESS)
        }
    }

    componentDidMount(){
        this.state.socket.on("created", (roomName) => {
            console.log(roomName + " CREATED!");
            this.state.socket.close();
            window.location.href = '/room/' + roomName;
        });
        this.state.socket.on("joinable", roomName => {
            window.location.href = '/room/' + roomName;
        });
        this.state.socket.on("roomsList", rList => { 
            this.setState({roomsList: rList});
        });
        this.state.socket.on("ERR", (err) => { 
            console.error(err.msg);
            alert(err.msg);
        });
    }
    
    lastClickedElem;
    showOnclick(elementId){
        let clickedElm = document.getElementById(elementId);
        if(this.lastClickedElem != null && this.lastClickedElem !== clickedElm)
            this.lastClickedElem.style.display = "none";
        this.lastClickedElem = clickedElm;

        if (clickedElm.style.display === "none")
            clickedElm.style.display = "block";
        else
            clickedElm.style.display = "none";
    }

    createRoom(name){
        this.state.socket.emit("create", name);
    }
    joinRoom(name){
        this.state.socket.emit("join", name);
    }
    listRooms(){
        this.state.socket.emit("listRooms");
    }

    setRoomName(name, btnType){
        if(!name){ 
            if(btnType === "JOIN")
                this.setState({joinRoomBtn: ''}) ;
            else
                this.setState({createRoomBtn: ''}) ;
            return ;
        }
        if(btnType === "JOIN"){
            let link = (<Link to={''}><input name="submitJoin" type="button" value={btnType}
                onClick={(e) => this.joinRoom(name, e)}/></Link>);
            this.setState({joinRoomBtn: link});
        }
        else if(btnType === "CREATE"){
            let link = (
            <Link to={''}><input name="submitJoin" type="button" value={btnType}
                onClick={(e) => this.createRoom(name, e)}
            />
            </Link>);
            this.setState({createRoomBtn: link});
        }
    }
    
    render(){
        return(
            <div className="kazzContainer">
                <div className="main-menuWrapper">
                    <div className="gameTitle">
                        <h1>Kazz IO</h1>
                    </div>
                    <div className="navBar">
                    </div>
                    <div className="gameCover">
                        <p><span>Will You Survive?</span></p>
                        <img src={logo} className="App-logo" alt="logo" />
                    </div>
                    <div className="menu">
                        <div className="btn createRoomBtn">
                            <span onClick={(e) => this.showOnclick("createRoomPopup", e)}>Create Room</span>
                            <div className="roomPopups" id="createRoomPopup" style={{display:"none"}}>
                                    <p>Create<br/>Room name:&nbsp;
                                        <input name="roomName" 
                                            type="text"
                                            method="none"
                                            onChange={(e) => this.setRoomName(e.target.value, "CREATE")}/>
                                        {this.state.createRoomBtn}
                                    </p>
                            </div>
                        </div>
                        <div className="btn joinRoomBtn">
                            <span onClick={(e) => this.showOnclick("joinRoomPopup", e)}>Join Room</span>
                            <div className="roomPopups" id="joinRoomPopup" style={{display:"none"}}>
                                    <p>Room name:&nbsp;
                                        <input id="joinRoomTextbox" 
                                        name="roomName" 
                                        type="text" 
                                        method="none" 
                                        onChange={(e) => this.setRoomName(e.target.value, "JOIN")}/>
                                        {this.state.joinRoomBtn}
                                    </p>
                            </div>
                        </div>
                        <div className="btn showAllRoomsBtn">
                        <span onClick={(e) => {
                            this.showOnclick("roomsList", e);
                            this.listRooms(e)
                            }}>Find Room</span>
                            <div className="roomPopups" id="roomsList" style={{display:"none"}}>
                                    <ul style={{padding: 15}}>Rooms currently open:&nbsp;
                                        {this.state.roomsList.map(room => <li style={{textAlign: "left"}}>{ room }</li>)}
                                    </ul>
                            </div>
                        </div>
                        <div className="btn credits">
                            <span>
                                <Link to="/credits" style={{ textDecoration: 'none', color: 'inherit'}}>Credits</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}