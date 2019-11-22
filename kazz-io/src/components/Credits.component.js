import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Credits extends Component{
    render(){
        return(
            <div className="kazzContainer">
                <p>
                    Created by a solo developer : BarKazzaz<br/>
                    Open source at GitHub: <a className="btn" href="https://github.com/BarKazzaz/kazz-io">@BarKazzaz</a>
                </p>
                <Link className="btn" to="/"><span>Back</span></Link>
            </div>
        );
    }
}