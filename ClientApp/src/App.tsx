import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import About from "./Screens/About";
import Home from "./Screens/Home";
import GameList from "./Screens/GameList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="games" element={<GameList />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
