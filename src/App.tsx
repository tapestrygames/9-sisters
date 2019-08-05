import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
// import logo from './logo.svg';
import "./App.styl";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faShoePrints, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faBullseyeArrow , faSword } from '@fortawesome/pro-solid-svg-icons'

import MainMenu from "./shared/components/MainMenu/MainMenu";
import Battlefield from "./scenes/Battlefield/Battlefield";

library.add(faBullseyeArrow, faSword, faShoePrints, faTimes);

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
