/**
 * @module Header This module implements the functionality and the HTML of header
 */
import React from "react";

export const Header = ({}) => {
  return (
    <header className="header">
      <img className="header-logo" src="./images/avengers-logo.webp"></img>
      <h1 className="header-title">Avengers New Recurit Portal</h1>
    </header>
  );
};
