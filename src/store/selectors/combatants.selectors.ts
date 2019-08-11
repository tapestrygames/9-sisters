import { createSelector, Selector } from "reselect";
import {
  Combatant,
  CombatantPositionMap,
  Faction
} from "../../scenes/Battlefield/types/combatant";
import { CombatantState, SistersState } from "../types/SistersState";

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
  Combatant | undefined
>(
  [getCombatantList],
  (combatants: Combatant[]): Combatant | undefined => {
    const selected: Combatant[] = combatants.filter(
      (c: Combatant) => c.selected
    );
    return selected.length > 0 ? selected[0] : undefined;
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

export const getPlayers = createSelector<
  SistersState,
  Combatant[],
  Combatant[]
>(
  [getCombatantList],
  (combatants: Combatant[]) =>
    combatants.filter(c => c.faction === Faction.PLAYER)
);

export const getEnemies = createSelector<
  SistersState,
  Combatant[],
  Combatant[]
>(
  [getCombatantList],
  (combatants: Combatant[]) =>
    combatants.filter(c => c.faction === Faction.ENEMY)
);
