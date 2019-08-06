import { Position } from "../../../shared/types/coord";

export type PositionRuleFunc = (position: Position) => boolean;

export enum Faction {
  PLAYER,
  ENEMY
}

export enum CombatantShape {
  SQUARE,
  CIRCLE
}

export enum CombatantAttackType {
  MELEE,
  RANGED,
  MYSTIC,
  PSYCHIC
}

export enum CombatantAction {
  MOVE,
  ATTACK
}

export interface Combatant {
  name: string;
  faction: Faction;
  position: Position;
  color: string;
  shape: CombatantShape;
  selected?: boolean;
  movementRate: number;
  startingPositionRule?: PositionRuleFunc;
  currentPath?: Position[];
  initiative?: number;
  attackRange: number;
  attackType: CombatantAttackType;
  action?: CombatantAction;
  target?: Combatant;
}

export type CombatantPositionMap = {[id:string]: Combatant};

