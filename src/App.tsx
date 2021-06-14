import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UploadPhotoComponent from "./components/organisms/upload-photo.component";
import TMapComponent from "./components/organisms/tmap.component";
import Home from "./components/organisms/home.component";

function App() {
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
      {/*<Navigation />*/}
    </Router>
  );
}

export default App;
