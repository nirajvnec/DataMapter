import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { TechnologyProvider } from "./TechnologyContext";

ReactDOM.render(
  <React.StrictMode>
    <TechnologyProvider>
      <App />
    </TechnologyProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
