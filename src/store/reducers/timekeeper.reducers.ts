import { combineReducers } from "redux";
import { createReducer } from "typesafe-actions";
import { Phase } from "../../scenes/Battlefield/types/Phase";
import { incTurn, setPhase } from "../actions/timekeeper.actions";

export const turnReducers = createReducer(1).handleAction(
  incTurn,
  (state, action) => state + 1
);
export const phaseReducers = createReducer(Phase.INIT).handleAction(
  setPhase,
  (state, action) => action.payload
);

export default combineReducers({ turn: turnReducers, phase: phaseReducers });
