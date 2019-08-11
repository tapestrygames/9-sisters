import { createSelector, Selector } from "reselect";
import { LoggingState, SistersState } from "../types/SistersState";

export const getLogging: Selector<SistersState, LoggingState> = (
  state: SistersState
) => state.logging;

export const getCombatLogEntries = createSelector<
  SistersState,
  LoggingState,
  string[]
>(
  [getLogging],
  (state: LoggingState) => {
    return state.combatLogEntries;
  }
);
