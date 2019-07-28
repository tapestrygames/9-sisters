import { Coord } from "../../../shared/types/coord";

export interface Combatant {
  name: string;
  position: Coord;
  color: string;
  selected?: boolean;
}
