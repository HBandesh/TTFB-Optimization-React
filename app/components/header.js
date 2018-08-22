import React from 'react';

export const  Header = ({}) => {
    return(
        <header className="header">
            <img className="header-logo bounceInDown animated" src="./avengers-logo.png"></img>
            <h1 className="header-title fadeInRight animated">
                Welcome to Avengers New Recurit Portal
            </h1>
        </header>
    );
}