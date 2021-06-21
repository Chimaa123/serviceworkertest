import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UploadPhotoComponent from "./components/organisms/upload-photo.component";
import TMapComponent from "./components/organisms/tmap.component";
import Home from "./components/organisms/home.component";
import { useStatus } from "./registrationStatus";

function App() {
  const status = useStatus();

  useEffect(() => {
    if (navigator.serviceWorker.controller) {
      //listen to messages
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("onMessage", event.data);
        if (event.data && event.data.type === "MSG_ID") {
          alert("Upload completed.");
          //process response
        }
      });
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/upload">
          <UploadPhotoComponent />
        </Route>
        <Route path="/tmap">
          <TMapComponent />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      <nav>
        <div>{status}</div>
      </nav>
    </Router>
  );
}

export default App;
