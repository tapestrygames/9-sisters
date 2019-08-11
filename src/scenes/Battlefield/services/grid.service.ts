import PF, { DiagonalMovement } from "pathfinding";

import { R } from "../../../shared/services/R";
import { Coord, Position } from "../../../shared/types/coord";
import { Combatant } from "../types/combatant";
import { GridPosition } from "../types/GridPosition";
import { Square } from "../types/square";

export interface PathOptions {
  allowDiagonal?: boolean;
  dontCrossCorners?: boolean;
  compress?: boolean;
}

export interface ToPXOptions {
  center?: boolean;
}

export class GridServiceClass {
  public readonly gridSize: number = 80;

  public toPx(position: Position, options: ToPXOptions = {}): Coord {
    let offset = 0;
    if (options.center) {
      offset = Math.trunc(this.gridSize / 2);
    }

    return {
      x: position.x * this.gridSize + offset,
      y: position.y * this.gridSize + offset
    };
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

  public matrix(positions: GridPosition[][]) {
    const matrix: number[][] = [];
    for (const row of positions) {
      matrix.push(row.map(c => (c.open ? 0 : 1)));
    }
    return matrix;
  }

  public reachableSquares(
    matrix: number[][],
    position: Position,
    movement: number
  ) {
    const reachableSquares: Position[] = [];
    matrix.forEach((row, rowIndex) =>
      row.forEach((col, colIndex) => {
        if (!col) {
          if (
            GridService.pathBetween(matrix, position, {
              x: colIndex,
              y: rowIndex
            }).length <=
            movement + 1
          ) {
            reachableSquares.push({ x: colIndex, y: rowIndex });
          }
        }
      })
    );
    return reachableSquares;
  }

  public findOpenPosition(
    layout: Square[],
    combatants: Combatant[],
    combatant: Combatant
  ): Square {
    return R.pick<Square>(
      layout.filter(
        (square: Square) =>
          square.open &&
          combatants.filter(
            c =>
              c.position.x === square.position.x &&
              c.position.y === square.position.y
          ).length === 0 &&
          (combatant.startingPositionRule || (() => true))(square.position)
      )
    );
  }
}

export const GridService = new GridServiceClass();
