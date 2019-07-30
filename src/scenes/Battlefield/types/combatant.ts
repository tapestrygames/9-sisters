import { Position } from "../../../shared/types/coord";

export type PositionRuleFunc = (position: Position) => boolean;

export interface Combatant {
  name: string;
  position: Position;
  color: string;
  selected?: boolean;
  movement: number;
  startingPositionRule?: PositionRuleFunc;
}
