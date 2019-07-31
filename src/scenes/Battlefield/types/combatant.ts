import { Position } from "../../../shared/types/coord";

export type PositionRuleFunc = (position: Position) => boolean;

export enum Faction {
  PLAYER,
  ENEMY
}

export interface Combatant {
  name: string;
  faction: Faction;
  position: Position;
  color: string;
  selected?: boolean;
  movementRate: number;
  startingPositionRule?: PositionRuleFunc;
  currentPath?: Position[];
}
