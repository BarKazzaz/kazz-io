import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
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
  );
}

export default App;
