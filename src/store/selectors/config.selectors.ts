import { createSelector, Selector } from "reselect";
import { Size } from "../../shared/types/coord";
import { ConfigState, SistersState } from "../types/SistersState";

export const getConfig: Selector<SistersState, ConfigState> = (
  state: SistersState
) => state.config;

export const getMapSize = createSelector<SistersState, ConfigState, Size>(
  [getConfig],
  (config: ConfigState) => config.mapSize
);

export const getSquareSize = createSelector<SistersState, ConfigState, number>(
  [getConfig],
  (config: ConfigState) => config.squareSize
);
