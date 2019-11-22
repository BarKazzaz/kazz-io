import React, { Component } from 'react';

export default class Game extends Component{
    render(){
        return(
            <div className="kazzContainer">
                <div className="gameWrapper">
                    <h1>The Game</h1>
                    <canvas 
                        id="gameCanvas"
                        width="680"
                        height="420">
                    </canvas>
                </div>
            </div>
        );
    }
}