import { combineReducers } from "redux";
import { createReducer } from "typesafe-actions";
import { addToCombatLog } from "../actions";
import { LoggingState } from "../types/SistersState";

export const logEntriesReducers = createReducer<string[]>([]).handleAction(
  addToCombatLog,
  (state, action) => [...state, action.payload]
);

export default combineReducers<LoggingState>({
  combatLogEntries: logEntriesReducers
});
