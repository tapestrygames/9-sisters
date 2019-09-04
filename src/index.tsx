import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./css/tailwind.css";
import "./index.styl";
import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import openSocket from "socket.io-client";
import { GridService } from "./scenes/Battlefield/services/grid.service";
import {
  Combatant,
  CombatantAction,
  CombatantAttackType,
  CombatantShape,
  Faction
} from "./scenes/Battlefield/types/combatant";
import { Phase } from "./scenes/Battlefield/types/Phase";
import { NO_SQUARE } from "./scenes/Battlefield/types/square";
import { R } from "./shared/services/R";
import { Position } from "./shared/types/coord";
import { notificationActions } from "./store/actions/notification.actions";
import rootReducer from "./store/reducers/reducers";
import { SistersState, SquareState } from "./store/types/SistersState";

const logger = createLogger({
  // ...options
});

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
      attackRange: 1,
      action: CombatantAction.NONE
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
      attackRange: 8,
      action: CombatantAction.NONE
    },
    "Troll #1": {
      color: "green",
      faction: Faction.ENEMY,
      movementRate: 2,
      name: "Troll #1",
      position: { x: -1, y: -1 },
      shape: CombatantShape.SQUARE,
      startingPositionRule: (position: Position) => position.y >= 5,
      attackType: CombatantAttackType.MELEE,
      attackRange: 1,
      action: CombatantAction.NONE
    },
    "Imp #1": {
      color: "red",
      faction: Faction.ENEMY,
      movementRate: 8,
      name: "Imp #1",
      position: { x: -1, y: -1 },
      shape: CombatantShape.SQUARE,
      startingPositionRule: (position: Position) => position.y >= 5,
      attackType: CombatantAttackType.RANGED,
      attackRange: 6,
      action: CombatantAction.NONE
    },
    "Skeleton #1": {
      color: "grey",
      faction: Faction.ENEMY,
      movementRate: 4,
      name: "Skeleton #1",
      position: { x: -1, y: -1 },
      shape: CombatantShape.SQUARE,
      startingPositionRule: (position: Position) => position.y >= 5,
      attackType: CombatantAttackType.MELEE,
      attackRange: 1,
      action: CombatantAction.NONE
    }
  },
  config: {
    mapSize: { w: 10, h: 10 },
    squareSize: 80
  },
  hover: {
    hoveredPath: [],
    hoveredSquare: NO_SQUARE
  },
  logging: {
    combatLogEntries: []
  },
  squares: { size: { w: 0, h: 0 }, squares: {} },
  timekeeper: {
    phase: Phase.INIT,
    turn: 1
  }
};

// initialStore.squares = new Array(100).fill(0).reduce((r: SquareState, v, i) => {
//   r[`(${Math.trunc(i / 10)},${i % 10})`] = {
//     open: R.pct(90),
//     occupied: false,
//     enemy: false,
//     position: { x: Math.trunc(i / 10), y: i % 10 }
//   };
//   return r;
// }, {});

// Object.values(initialStore.combatants).forEach((combatant: Combatant) => {
//   combatant.position = GridService.findOpenPosition(
//     Object.values(initialStore.squares),
//     Object.values(initialStore.combatants),
//     combatant
//   ).position;
// });

const middleware =
  process.env.NODE_ENV === "production" ? [thunk] : [thunk, logger];

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

const store = createStore(
  rootReducer,
  initialStore,
  composeEnhancers(applyMiddleware(...middleware))
);

const socket: SocketIOClient.Socket = openSocket("http://localhost:1714");

socket.on("message", ({ name, payload }: any) => {
  console.log("SOCKET", name, payload);
  store.dispatch(notificationActions[name](payload));
});

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
