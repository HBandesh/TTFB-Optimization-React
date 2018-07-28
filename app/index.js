import React from 'react';
import  {hydrate} from "react-dom";

import App from "./components/App"

window.mainContent = window.mainContent || JSON.parse(document.getElementById("initial-data").dataset.json);
hydrate(<App content ={window.mainContent}/>, document.getElementById('root'));