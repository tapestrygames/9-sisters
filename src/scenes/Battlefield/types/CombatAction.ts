import { Position } from "../../../shared/types/coord";
import { Combatant, CombatantAction } from "./combatant";

export interface CombatAction {
  action: CombatantAction;
  combatant: Combatant;

  to?: Position;
  targetId?: string;
}
