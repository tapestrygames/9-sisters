import { Action, createReducer } from "typesafe-actions";
import { Faction } from "../../scenes/Battlefield/types/combatant";
import {
  clearPath,
  moveCombatant,
  MoveCombatantPayload,
  selectCombatant,
  selectNextCombatant,
  setAction,
  SetActionPayload,
  setPath,
  SetPathPayload,
  setTarget,
  SetTargetPayload,
  updateCombatant,
  UpdateCombatantPayload
} from "../actions";
import { CombatantState } from "../types/SistersState";

const combatantsReducers = createReducer<CombatantState, Action>({})
  .handleAction(
    moveCombatant,
    (state: CombatantState, action: { payload: MoveCombatantPayload }) => {
      const combatant = {
        ...state[action.payload.combatantId],
        position: action.payload.to
      };
      return { ...state, [action.payload.combatantId]: combatant };
    }
  )
  .handleAction(
    selectCombatant,
    (state: CombatantState, combatantId: string) => {
      const selectedCombatantList = Object.values(state).filter(
        c => c.selected
      );
      const changedCombatants: CombatantState = {
        [combatantId]: { ...state[combatantId], selected: true }
      };

      if (selectedCombatantList.length > 0) {
        changedCombatants[selectedCombatantList[0].name] = {
          ...state[selectedCombatantList[0].name],
          selected: false
        };
      }
      return { ...state, ...changedCombatants };
    }
  )
  .handleAction(
    selectNextCombatant,
    (state: CombatantState, action: { payload: string }) => {
      const combatantId = action.payload;
      const selectedCombatantList = Object.values(state).filter(
        c => c.selected
      );
      const nonSelectedCombatantList = Object.values(state).filter(
        c =>
          !c.selected && c.faction === Faction.PLAYER && c.name !== combatantId
      );
      const changedCombatants: CombatantState = {
        [nonSelectedCombatantList[0].name]: {
          ...state[nonSelectedCombatantList[0].name],
          selected: true
        }
      };

      if (selectedCombatantList.length > 0) {
        changedCombatants[selectedCombatantList[0].name] = {
          ...state[selectedCombatantList[0].name],
          selected: false
        };
      }
      return { ...state, ...changedCombatants };
    }
  )
  .handleAction(
    clearPath,
    (state: CombatantState, action: { payload: string }) => {
      const combatantId = action.payload;
      const combatant = { ...state[combatantId], currentPath: [] };
      return { ...state, [combatantId]: combatant };
    }
  )
  .handleAction(
    setPath,
    (state: CombatantState, action: { payload: SetPathPayload }) => {
      const combatant = {
        ...state[action.payload.combatantId],
        currentPath: action.payload.path
      };
      return { ...state, [action.payload.combatantId]: combatant };
    }
  )
  .handleAction(
    updateCombatant,
    (state: CombatantState, action: { payload: UpdateCombatantPayload }) => {
      const combatant = {
        ...state[action.payload.combatantId],
        ...action.payload.data
      };
      return { ...state, [action.payload.combatantId]: combatant };
    }
  )
  .handleAction(
    setAction,
    (state: CombatantState, action: { payload: SetActionPayload }) => {
      const combatant = {
        ...state[action.payload.combatantId],
        action: action.payload.action
      };
      return { ...state, [action.payload.combatantId]: combatant };
    }
  )
  .handleAction(
    setTarget,
    (state: CombatantState, action: { payload: SetTargetPayload }) => {
      const combatant = {
        ...state[action.payload.combatantId],
        targetId: action.payload.targetId
      };
      return { ...state, [action.payload.combatantId]: combatant };
    }
  );

export default combatantsReducers;
