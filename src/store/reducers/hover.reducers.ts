import { combineReducers } from "redux";
import { createReducer } from "typesafe-actions";
import { NO_SQUARE } from "../../scenes/Battlefield/types/square";
import { Position } from "../../shared/types/coord";
import {
  clearHoveredPath,
  clearHoveredSquare,
  setHoveredPath,
  setHoveredSquare
} from "../actions";
import { HoverState } from "../types/SistersState";

export const pathReducers = createReducer<Position[]>([])
  .handleAction(setHoveredPath, (state, action) => action.payload)
  .handleAction(clearHoveredPath, state => []);

export const squareReducers = createReducer(NO_SQUARE)
  .handleAction(setHoveredSquare, (state, action) => action.payload)
  .handleAction(clearHoveredSquare, state => NO_SQUARE);

export default combineReducers<HoverState>({
  hoveredPath: pathReducers,
  hoveredSquare: squareReducers
});
