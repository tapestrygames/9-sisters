import { createAction } from "typesafe-actions";
import { Phase } from "../../scenes/Battlefield/types/Phase";

export const INC_TURN = "incTurn";
export const incTurn = createAction(INC_TURN);

export const SET_PHASE = "setPhase";
export const setPhase = createAction(SET_PHASE, action => (phase: Phase) =>
  action(phase)
);
