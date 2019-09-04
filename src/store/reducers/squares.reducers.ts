import { createReducer } from "typesafe-actions";
import { Action } from "typesafe-actions/dist/type-helpers";
import { Square } from "../../scenes/Battlefield/types/square";
import {
  BattleStartedPayload,
  SquareClientData
} from "../../shared/types/ClientData";
import { battleStarted } from "../actions/notification.actions";
import { SquareState } from "../types/SistersState";

const battlefieldReducers = createReducer<SquareState, Action>({
  size: { w: 0, h: 0 },
  squares: {}
}).handleAction(
  battleStarted,
  (state: SquareState, action: { payload: BattleStartedPayload }) => {
    const w = Number((action.payload.battlefield.size as string).split("x")[0]);
    const h = Number((action.payload.battlefield.size as string).split("x")[1]);
    return {
      size: {
        h,
        w
      },
      squares: action.payload.battlefield.squares.reduce(
        (r: { [id: string]: Square }, sq: SquareClientData, i) => {
          r[`(${Math.trunc(i / w)},${i % h})`] = {
            enemy: false,
            occupied: false,
            open: sq.open,
            position: { x: Math.trunc(i / w), y: i % h }
          };
          return r;
        },
        {}
      )
    };
  }
);

export default battlefieldReducers;
