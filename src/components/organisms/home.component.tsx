import React from "react";
import logo from "../../logo.svg";
import { Button } from "antd";
function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Feature test sample PWApp</p>
        <Button href={"/tmap"}>Tmap</Button>{" "}
        <Button href={"/upload"}>Upload</Button>
      </header>
    </div>
  );
}

export default Home;
