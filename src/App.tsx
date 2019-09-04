import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
// import logo from './logo.svg';
import "./App.styl";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faShoePrints, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faBullseyeArrow, faSword } from "@fortawesome/pro-solid-svg-icons";

import openSocket from "socket.io-client";
import BattlefieldContainer from "./scenes/Battlefield/BattlefieldContainer";
import MainMenu from "./shared/components/MainMenu/MainMenu";
library.add(faBullseyeArrow, faSword, faShoePrints, faTimes);


class App extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);

  }
  public render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Route path="/(.+)" render={props => <MainMenu {...props} />} />
          <Route path="/battle" component={BattlefieldContainer} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
