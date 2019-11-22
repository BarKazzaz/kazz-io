import React, { Component } from 'react';
import logo from '../logo.svg';

export default class MainMenu extends Component{
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
                        <span>Create Room</span>
                        </div>
                        <div className="btn joinRoomBtn">
                            <span>Join Room</span>
                        </div>
                        <div className="btn showAllRoomsBtn">
                            <span>Find Room</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}