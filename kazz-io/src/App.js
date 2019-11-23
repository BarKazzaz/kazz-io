import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import MainMenu from './components/MainMenu.component';
import Game from './components/Game.component';
import DefaultComponent from './components/DefaultComponent.component';
import Credits from './components/Credits.component';

function App() {
  return (
    <Router>
      <Switch>
        {/* Switch make only the first matching route to be displayed */}
        <Route exact path="/" component={MainMenu}/>
        <Route exact path="/credits" component={Credits}/>
        <Route path="/room/:id" component={Game}/>
        <Route component={DefaultComponent}/>
      </Switch>
    </Router>
  );
}

export default App;
