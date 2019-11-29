import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Popup extends Component {
    constructor(props){
        super(props);
        this.state = {
            class_name : "roomPopups",
            ID : props.ID,
            title : props.title,
            inputName : props.inputName,
            btnValue: props.btnValue,
            btn : ''
        }
    }



    toggleBtnVisibility(e){
        let inputStr = e.target.value;
        if(!inputStr)
            this.setState({btn:''});
        else{
            let arr = [inputStr, this.state.ID]
            this.setState({btn: <Link to={''}>
                                    <input name="submit" 
                                    type="button" 
                                    value={this.state.btnValue} 
                                    onClick={(e) => this.props.btnOnClickAction(arr, e)}/>
                                </Link>
                            })
        }
    }

    render(){
        return(
            <div className={this.state.class_name} id={this.state.ID} style={{display:"none"}}>
                <div>{this.state.title}
                    <input name="roomName" 
                        type="text"
                        method="none"
                        onChange={(e) => this.toggleBtnVisibility(e)}/>
                    {this.state.btn}
                </div>
            </div>
        )
    }
}