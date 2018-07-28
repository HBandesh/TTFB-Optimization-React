import React from 'react';

export class Header extends React.Component {

    constructor() {
        super();
    }

    render() {
        return(
            <header>
                <div style={{display: 'none'}}>
                </div>
                {/*<div style={{display:"none"}}>{Data.getJunk().join("")}</div> USE THIS CODE IN CASE OF SAFARI ONLY*/}
                <h1>
                    Welcome to Chuked Application
                </h1>
                <div>
                   <a  onClick={() => alert("event attached")}>Action : Click me!</a> 
                </div>
            </header>
        );
    }
}