import { createSelector, Selector } from "reselect";
import { Square } from "../../scenes/Battlefield/types/square";
import { Position } from "../../shared/types/coord";
import { HoverState, SistersState } from "../types/SistersState";

export const getHover: Selector<SistersState, HoverState> = (
  state: SistersState
) => state.hover;

export const getHoveredPath = createSelector<
  SistersState,
  HoverState,
  Position[]
>(
  [getHover],
  (state: HoverState) => state.hoveredPath
);

export const getHoveredSquare = createSelector<
  SistersState,
  HoverState,
  Square
>(
  [getHover],
  (state: HoverState) => state.hoveredSquare
);
