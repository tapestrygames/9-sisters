import { Selector } from "reselect";
import { SistersState } from "../types/SistersState";
import { Phase } from "../../scenes/Battlefield/types/Phase";

export const getPhase: Selector<SistersState, Phase> = (
  state: SistersState
) => state.phase;
