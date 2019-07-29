import { Position } from "../../../shared/types/coord";

export interface Combatant {
  name: string;
  position: Position;
  color: string;
  selected?: boolean;
}
