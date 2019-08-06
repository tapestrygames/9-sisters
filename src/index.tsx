import React from "react";
import ReactDOM from "react-dom";
import "./index.styl";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./css/tailwind.css";

import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./store/reducers/reducers";
import {
  Combatant,
  CombatantAttackType,
  CombatantShape,
  Faction
} from "./scenes/Battlefield/types/combatant";
import { Position } from "./shared/types/coord";
import { SistersState } from "./store/types/SistersState";
import { GridPosition } from "./scenes/Battlefield/types/GridPosition";
import { R } from "./shared/services/R";
import { testCombatants } from "./shared/testdata";
import { GridService } from "./scenes/Battlefield/services/grid.service";
import { Phase } from "./scenes/Battlefield/types/Phase";

const initialStore: SistersState = {
  combatants: {
    Dhrami: {
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
  },
  squares: {},
  turn: 1,
  phase: Phase.INIT,
  logEntries: [],
  mapSize: { w: 10, h: 10 },
  squareSize: 80
};

initialStore.squares = new Array(100).reduce((r, v, i) => {
  r[`(${Math.trunc(i / 10)},${i % 10})`] = {
    open: R.pct(90),
    position: { x: Math.trunc(i / 10), y: i % 10 }
  };
  return r;
}, {});

Object.values(initialStore.combatants).forEach(
  (combatant: Combatant) =>
    (combatant.position = GridService.findOpenPosition(
      Object.values(initialStore.squares),
      Object.values(initialStore.combatants),
      combatant
    ).position)
);

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
