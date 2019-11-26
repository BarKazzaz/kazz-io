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
            socket: io(SERVER_ADDRESS)
        }
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
        this.state.socket.on("created", console.log(name + " CREATED!"));
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
            let link = (<Link to={'/room/'+name}><input name="submitJoin" type="button" value={btnType}/></Link>);
            this.setState({joinRoomBtn: link});
        }
        else if(btnType === "CREATE"){
            let link = (
            <Link to={'/room/'+name}><input name="submitJoin" type="button" value={btnType}
                onClick={(e) => this.createRoom(name,e)}
            />
            </Link>);
            this.setState({createRoomBtn: link});
        }
    }

    render(){
        document.getElementById("joinRoomTextbox");
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
                                    <p>Room name:
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
                                    <p>Room name:
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
                            <span>Find Room</span>
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