import { createSelector, Selector } from "reselect";
import { Phase } from "../../scenes/Battlefield/types/Phase";
import { SistersState, TimekeeperState } from "../types/SistersState";

export const getTimekeeper: Selector<SistersState, TimekeeperState> = (
  state: SistersState
) => state.timekeeper;

export const getTurn = createSelector<SistersState, TimekeeperState, number>(
  [getTimekeeper],
  (timekeeper: TimekeeperState) => timekeeper.turn
);

export const getPhase = createSelector<SistersState, TimekeeperState, Phase>(
  [getTimekeeper],
  (timekeeper: TimekeeperState) => timekeeper.phase
);
