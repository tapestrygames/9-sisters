import { Coord, Position } from "../../../shared/types/coord";

export class GridServiceClass {
  private readonly gridSize: number = 80;

  public toPx(position: Position): Coord {
    return { x: position.x * this.gridSize, y: position.y * this.gridSize };
  }

  public toPosition(coord: Coord): Position {
    return {
      x: Math.trunc(coord.x / this.gridSize),
      y: Math.trunc(coord.y / this.gridSize)
    };
  }
}

export const GridService = new GridServiceClass();
