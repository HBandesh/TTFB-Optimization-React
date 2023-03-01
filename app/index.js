import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./components/App.jsx";

hydrateRoot(document.getElementById("root"), <App data={window.dataLayer} />);
