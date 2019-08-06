import { Combatant } from "../../scenes/Battlefield/types/combatant";
import { Square } from "../../scenes/Battlefield/types/square";
import { Position, Size } from "../../shared/types/coord";

export type CombatantState = { [id: string]: Combatant };
export type SquareState = { [id: string]: Square };

export interface SistersState {
  combatants: CombatantState;
  squares: SquareState;
  turn: number;
  phase: number;
  logEntries: string[];
  hoveredSquare?: Square;
  hoveredPath?: Position[];
  mapSize: Size;
  squareSize: number;
}
