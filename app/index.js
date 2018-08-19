import React from 'react';
import  {hydrate} from "react-dom";
import App from "./components/app";

hydrate(<App data={window.dataLayer}/>, document.getElementById('root'));