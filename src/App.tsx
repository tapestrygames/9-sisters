import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
// import logo from './logo.svg';
import "./App.styl";
import MainMenu from "./shared/components/MainMenu/MainMenu";
import Battlefield from "./scenes/Battlefield/Battlefield";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Route path="/(.+)" render={props => <MainMenu {...props} />} />
        <Route path="/battle" component={Battlefield}/>
      </div>
    </BrowserRouter>
  );
}

export default App;
