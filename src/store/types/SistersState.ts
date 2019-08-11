import { Combatant } from "../../scenes/Battlefield/types/combatant";
import { Square } from "../../scenes/Battlefield/types/square";
import { Position, Size } from "../../shared/types/coord";

export interface CombatantState {
  [id: string]: Combatant;
}

export interface SquareState {
  [id: string]: Square;
}

export interface TimekeeperState {
  turn: number;
  phase: number;
}

export interface ConfigState {
  mapSize: Size;
  squareSize: number;
}

export interface LoggingState {
  combatLogEntries: string[];
}

export interface HoverState {
  hoveredSquare: Square;
  hoveredPath: Position[];
}

export interface SistersState {
  combatants: CombatantState;
  squares: SquareState;
  timekeeper: TimekeeperState;
  config: ConfigState;
  logging: LoggingState;
  hover: HoverState;
}
