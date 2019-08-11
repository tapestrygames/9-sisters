import { createAction, createStandardAction } from "typesafe-actions";
import { CombatantAction } from "../../scenes/Battlefield/types/combatant";
import { Position } from "../../shared/types/coord";

export const MOVE_COMBATANT = "moveCombatant";
export interface MoveCombatantPayload {
  combatantId: string;
  to: Position;
}
export const moveCombatant = createAction(
  MOVE_COMBATANT,
  action => (payload: MoveCombatantPayload) => action(payload)
);

export const SELECT_COMBATANT = "selectCombatant";
export const selectCombatant = createAction(
  SELECT_COMBATANT,
  action => (combatantId: string) => action(combatantId)
);

export const CLEAR_PATH = "clearPath";
export const clearPath = createAction(
  CLEAR_PATH,
  action => (combatantId: string) => action(combatantId)
);

export const SET_PATH = "setPath";
export interface SetPathPayload {
  combatantId: string;
  path: Position[];
}
export const setPath = createAction(
  SET_PATH,
  action => (payload: SetPathPayload) => action(payload)
);

export const SET_ACTION = "setAction";
export interface SetActionPayload {
  combatantId: string;
  action: CombatantAction;
}
export const setAction = createStandardAction(SET_ACTION)<SetActionPayload>();

export const SET_TARGET = "setTarget";
export interface SetTargetPayload {
  combatantId: string;
  targetId: string;
}

export const setTarget = createAction(
  SET_TARGET,
  action => (payload: SetTargetPayload) => action(payload)
);

export const SELECT_NEXT_COMBATANT = "selectNextCombatant";
export const selectNextCombatant = createAction(
  SELECT_NEXT_COMBATANT,
  action => (combatantId: string) => action(combatantId)
);

export const UPDATE_COMBATANT = "updateCombatant";
export interface UpdateCombatantPayload {
  combatantId: string;
  data: { [id: string]: any };
}
export const updateCombatant = createAction(
  UPDATE_COMBATANT,
  action => (payload: UpdateCombatantPayload) => action(payload)
);
