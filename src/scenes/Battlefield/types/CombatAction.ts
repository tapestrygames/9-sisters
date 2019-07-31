import { Position } from "../../../shared/types/coord";
import { Combatant } from "./combatant";

export enum CombatActionType {
  MOVE = "move"
}

export interface CombatAction {
  action: CombatActionType;
  combatant: Combatant;

  to?: Position;
}
