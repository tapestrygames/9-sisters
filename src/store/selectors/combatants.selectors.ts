import { CombatantState, SistersState } from "../types/SistersState";
import {
  Combatant,
  CombatantPositionMap
} from "../../scenes/Battlefield/types/combatant";
import { createSelector, Selector } from "reselect";

export const getCombatants: Selector<SistersState, CombatantState> = (
  state: SistersState
) => state.combatants;

export const getCombatantList = createSelector<
  SistersState,
  CombatantState,
  Combatant[]
>(
  getCombatants,
  (combatants: CombatantState) => Object.values(combatants)
);

export const getSelectedCombatant = createSelector<
  SistersState,
  Combatant[],
  Combatant | null
>(
  [getCombatantList],
  (combatants: Combatant[]) => {
    const selected: Combatant[] = combatants.filter(
      (c: Combatant) => c.selected
    );
    return selected.length > 0 ? selected[0] : null;
  }
);

export const getCombatantPositions = createSelector<
  SistersState,
  Combatant[],
  CombatantPositionMap
>(
  getCombatantList,
  (combatants: Combatant[]) =>
    combatants.reduce((r: CombatantPositionMap, v: Combatant) => {
      r[`(${v.position.x},${v.position.y})`] = v;
      return r;
    }, {})
);
