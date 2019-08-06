import { action } from "typesafe-actions";
import { Phase } from "../../scenes/Battlefield/types/Phase";
import { CombatantAction } from "../../scenes/Battlefield/types/combatant";

export const SET_PHASE = "setPhase";
export const setPhase = (phase: Phase) => action(SET_PHASE, phase);

export const MOVE_COMBATANT = "moveCombatant";
export const moveCombatant = (combatantId: string, position: Position) =>
  action(MOVE_COMBATANT, combatantId, position);

export const SELECT_COMBATANT = "selectCombatant";
export const selectCombatant = (combatantId: string) =>
  action(SELECT_COMBATANT, combatantId);

export const CLEAR_PATH = "clearPath";
export const clearPath = (combatantId: string) => action(CLEAR_PATH, combatantId);

export const CLEAR_HOVERED_PATH = "clearHoveredPath";
export const clearHoveredPath = () => action(CLEAR_HOVERED_PATH);

export const SET_ACTION = "setAction";
export const setAction = (componentId: string, a:CombatantAction) => action(SET_ACTION, componentId, a);

export const SET_TARGET = "setTarget";
export const setTarget = (componentId: string, targetId: string) => action(SET_TARGET, componentId, targetId);

