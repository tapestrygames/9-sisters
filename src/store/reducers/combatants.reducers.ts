import { Action, createReducer } from "typesafe-actions";
import {
  CombatantAction,
  CombatantAttackType,
  CombatantShape,
  Faction
} from "../../scenes/Battlefield/types/combatant";
import {
  BattleStartedPayload,
  EnemyClientData,
  HeroClientData
} from "../../shared/types/ClientData";
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
import { battleStarted } from "../actions/notification.actions";
import { CombatantState } from "../types/SistersState";

const colors = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928"
];
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
  )
  .handleAction(
    battleStarted,
    (state: CombatantState, action: { payload: BattleStartedPayload }) => {
      return {
        ...action.payload.heroes.reduce(
          (r: CombatantState, h: HeroClientData, i: number) => {
            r[h.name || "x"] = {
              action: CombatantAction.NONE,
              attackRange: 5,
              attackType: CombatantAttackType.RANGED,
              color: colors[i],
              faction: Faction.PLAYER,
              movementRate: 5,
              name: h.name as string,
              position: h.position || { x: 0, y: 0 },
              shape: CombatantShape.CIRCLE,
              startingPositionRule: () => true
            };
            return r;
          },
          {}
        ),
        ...action.payload.enemies.reduce(
          (r: CombatantState, h: EnemyClientData, i: number) => {
            r[h.name || "x"] = {
              action: CombatantAction.NONE,
              attackRange: 5,
              attackType: CombatantAttackType.RANGED,
              color: colors.reverse()[i],
              faction: Faction.ENEMY,
              movementRate: 5,
              name: h.name as string,
              position: h.position || { x: 0, y: 0 },
              shape: CombatantShape.SQUARE,
              startingPositionRule: () => true
            };
            return r;
          },
          {}
        )
      };
    }
  );

export default combatantsReducers;
