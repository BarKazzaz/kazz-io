import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

export default class MainMenu extends Component{

    constructor(props){
        super(props);
        this.showOnclick = this.showOnclick.bind(this);
    }
    
    lastClickedElem;
    
    showOnclick(elementId){
        let clickedElm = document.getElementById(elementId);
        if(this.lastClickedElem != null && this.lastClickedElem != clickedElm)
            this.lastClickedElem.style.display = "none";
        this.lastClickedElem = clickedElm;

        if (clickedElm.style.display == "none")
            clickedElm.style.display = "block";
        else
            clickedElm.style.display = "none";
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
                                <form name="createRoom" action="" method="post">
                                    <p>Room name:
                                        <input name="roomName" type="text"/>
                                        <center><input name="submitCreate" type="submit" value="Create"/></center>
                                    </p>
                                </form>
                            </div>
                        </div>
                        <div className="btn joinRoomBtn">
                            <span onClick={(e) => this.showOnclick("joinRoomPopup", e)}>Join Room</span>
                            <div className="roomPopups" id="joinRoomPopup" style={{display:"none"}}>
                                <form name="joinRoom" action="" method="post">
                                    <p>Room name:
                                        <input name="roomName" type="text"/>
                                        <center><input name="submitCreate" type="submit" value="Join"/></center>
                                    </p>
                                </form>
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