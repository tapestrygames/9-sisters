import React from "react";
import ReactDOM from "react-dom";
import "./index.styl";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./css/tailwind.css";

import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducers from "./store/reducers/reducers";
import {
  CombatantAttackType,
  CombatantShape,
  Faction
} from "./scenes/Battlefield/types/combatant";
import { Position } from "./shared/types/coord";


const initialStore : SistersStore = {
  combatants: {
    "Dhrami": {
      color: "blue",
      faction: Faction.PLAYER,
      movementRate: 5,
      name: "Dhrami",
      position: { x: -1, y: -1 },
      selected: true,
      shape: CombatantShape.CIRCLE,
      startingPositionRule: (position: Position) => position.y < 5,
      attackType: CombatantAttackType.MELEE,
      attackRange: 1
    },
    "Moire Caubelle": {
      color: "yellow",
      faction: Faction.PLAYER,
      movementRate: 5,
      name: "Moire Caubelle",
      position: { x: -1, y: -1 },
      shape: CombatantShape.CIRCLE,
      startingPositionRule: (position: Position) => position.y < 5,
      attackType: CombatantAttackType.RANGED,
      attackRange: 8
    },
    "Troll #1": {
      color: "green",
      faction: Faction.ENEMY,
      movementRate: 2,
      name: "Troll",
      position: { x: -1, y: -1 },
      shape: CombatantShape.SQUARE,
      startingPositionRule: (position: Position) => position.y >= 5,
      attackType: CombatantAttackType.MELEE,
      attackRange: 1
    },
    "Imp #1": {
      color: "red",
      faction: Faction.ENEMY,
      movementRate: 8,
      name: "Imp",
      position: { x: -1, y: -1 },
      shape: CombatantShape.SQUARE,
      startingPositionRule: (position: Position) => position.y >= 5,
      attackType: CombatantAttackType.RANGED,
      attackRange: 6
    },
    "Skeleton #1": {
      color: "grey",
      faction: Faction.ENEMY,
      movementRate: 4,
      name: "Skeleton",
      position: { x: -1, y: -1 },
      shape: CombatantShape.SQUARE,
      startingPositionRule: (position: Position) => position.y >= 5,
      attackType: CombatantAttackType.MELEE,
      attackRange: 1
    }
  }
};

const store = createStore(rootReducer, initialStore);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
