import { SquareState, SistersState } from "../types/SistersState";
import { createSelector, Selector } from "reselect";
import { Square } from "../../scenes/Battlefield/types/square";
import { Position } from "../../shared/types/coord.js";

export const getSquares: Selector<SistersState,SquareState> = (state : SistersState) => state.squares;

export const getSquare = createSelector<SistersState, SquareState,Square>(
  [getSquares],
  (squares: SquareState, props: any) => squares[`(${props.position.x},${props.position.y})`]
);

