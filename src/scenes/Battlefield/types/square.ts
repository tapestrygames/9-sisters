import { Position } from "../../../shared/types/coord";

export interface Square {
  enemy: boolean;
  occupied: boolean;
  open: boolean;
  position: Position;
}

export const NO_SQUARE: Square = {
  enemy: false,
  occupied: false,
  open: false,
  position: { x: -1, y: -1 }
};

export const NO_POSITION: Position = { x: -1, y: -1 };
