import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import io from "socket.io-client";
import logo from '../logo.svg';
import  Popup from './Popup.component'

const SERVER_ADDRESS = 'http://localhost:5000';


export default class MainMenu extends Component{

    constructor(props){
        super(props);
        this.showOnclick = this.showOnclick.bind(this);
        this.state = {
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
            console.log(roomName);
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
        this.state.socket.emit("isJoinable", name);
    }
    listRooms(){
        this.state.socket.emit("listRooms");
    }

    handlePopupSubmit = (arr_inStrAndpopID, event)=>{
        let inStr = arr_inStrAndpopID[0];
        let popID = arr_inStrAndpopID[1];
        
        if(popID.includes("create")){
            console.log("need to create a room: ", inStr);
            this.createRoom(inStr);
        }else if (popID.includes("join")){
            console.log("need to join to room: ", inStr);
            this.joinRoom(inStr);
        }
    }
    
    render(){
        return(
            <div className="kazzContainer">
                <div className="main-menuWrapper">
                    <div className="gameTitle">
                        <h1>Kazz IO</h1>
                    </div>
                    <div className="gameCover">
                        <p><span>Will You Survive?</span></p>
                        <img src={logo} className="App-logo" alt="logo" />
                    </div>
                    <div className="menu">
                        <div className="btn createRoomBtn">
                            <span onClick={(e) => this.showOnclick("createRoomPopup", e)}>Create Room</span>
                            <Popup ID="createRoomPopup" 
                                title={<div>Create<br/>Room name:&nbsp;</div>}
                                btnValue={"Create"}
                                btnOnClickAction={this.handlePopupSubmit}>
                            </Popup>
                        </div>
                        <div className="btn joinRoomBtn">
                            <span onClick={(e) => this.showOnclick("joinRoomPopup", e)}>Join Room</span>
                            <Popup ID={"joinRoomPopup"} 
                                title={<div>Join<br/>Room name:&nbsp;</div>} 
                                btnValue={"Join"} 
                                btnOnClickAction={this.handlePopupSubmit}>
                            </Popup>
                        </div>
                        <div className="btn showAllRoomsBtn">
                        <span onClick={(e) => {
                            this.showOnclick("roomsList", e);
                            this.listRooms(e)
                            }}>Find Room</span>
                            <div className="roomPopups" id="roomsList" style={{display:"none"}}>
                                    <ul style={{padding: 15}}>Rooms currently open:<br/>
                                        {this.state.roomsList.map((room, i) => 
                                                                    <span key={i} 
                                                                        onClick={e => this.joinRoom(e.target.innerText)} 
                                                                        style={{display:"inline-block", width:"100%", margin: 2, backgroundColor: "rgba(35, 35, 35, 0.8)"}}>
                                                                        { room }
                                                                    </span>
                                                                )
                                        }
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