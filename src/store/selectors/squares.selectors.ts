import { createSelector, Selector } from "reselect";
import { GridService } from "../../scenes/Battlefield/services/grid.service";
import {
  CombatantPositionMap,
  Faction
} from "../../scenes/Battlefield/types/combatant";
import { Square } from "../../scenes/Battlefield/types/square";
import { Size } from "../../shared/types/coord";
import { SistersState, SquareState } from "../types/SistersState";
import { getCombatantPositions } from "./combatants.selectors";
import { getMapSize } from "./config.selectors";

export const getSquares: Selector<SistersState, SquareState> = (
  state: SistersState
) => state.squares;

export const getGrid = createSelector<
  SistersState,
  SquareState,
  Size,
  CombatantPositionMap,
  Square[][]
>(
  getSquares,
  getMapSize,
  getCombatantPositions,
  (
    squares: SquareState,
    mapSize: Size,
    combatantPositions: CombatantPositionMap
  ): Square[][] => {
    const res = new Array(mapSize.h)
      .fill(0)
      .map(() => new Array(mapSize.w).fill(0));
    Object.values(squares.squares).forEach((square: Square) => {
      const combatant =
        combatantPositions[`($square.position.x},${square.position.y})`];

      return (res[square.position.x][square.position.y] = {
        ...square,
        enemy: combatant && combatant.faction === Faction.ENEMY,
        occupied: !!combatant
      });
    });
    return res;
  }
);

export const getSquare = createSelector<SistersState, SquareState, Square>(
  [getSquares],
  (squares: SquareState, props: any) =>
    squares.squares[`(${props.position.x},${props.position.y})`]
);

export const getMatrix = createSelector<SistersState, Square[][], number[][]>(
  [getGrid],
  (squares: Square[][]) => GridService.matrix(squares)
);
