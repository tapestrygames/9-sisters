import PF, { DiagonalMovement } from "pathfinding";
import { Coord, Position } from "../../../shared/types/coord";

export interface PathOptions {
  allowDiagonal?: boolean;
  dontCrossCorners?: boolean;
  compress?: boolean;
}

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

  public pathBetween(
    matrix: number[][],
    from: Position,
    to: Position,
    options: PathOptions = {}
  ): Position[] {
    const grid = new PF.Grid(matrix);
    const pfind = new PF.AStarFinder({
      diagonalMovement:
        options.allowDiagonal === undefined || options.allowDiagonal
          ? options.dontCrossCorners === undefined || options.dontCrossCorners
            ? DiagonalMovement.OnlyWhenNoObstacles
            : DiagonalMovement.Always
          : DiagonalMovement.Never
    });
    let path = pfind.findPath(from.x, from.y, to.x, to.y, grid);

    if (options.compress) {
      path = PF.Util.compressPath(path);
    }
    return path.map((r: number[]) => ({ x: r[0], y: r[1] }));
  }
}

export const GridService = new GridServiceClass();
