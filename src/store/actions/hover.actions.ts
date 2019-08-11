import { createAction } from "typesafe-actions";
import { Square } from "../../scenes/Battlefield/types/square";
import { Position } from "../../shared/types/coord";

export const SET_HOVERED_SQUARE = "setHoveredSquare";
export const setHoveredSquare = createAction(
  SET_HOVERED_SQUARE,
  action => (hoveredSquare: Square) => action(hoveredSquare)
);

export const CLEAR_HOVERED_SQUARE = "clearHoveredSquare";
export const clearHoveredSquare = createAction(CLEAR_HOVERED_SQUARE);

export const SET_HOVERED_PATH = "setHoveredPath";
export const setHoveredPath = createAction(
  SET_HOVERED_PATH,
  action => (path: Position[]) => action(path)
);

export const CLEAR_HOVERED_PATH = "clearHoveredPath";
export const clearHoveredPath = createAction(CLEAR_HOVERED_PATH);
