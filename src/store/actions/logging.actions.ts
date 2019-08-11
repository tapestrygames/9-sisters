import { createAction } from "typesafe-actions";

export const ADD_TO_COMBAT_LOG = "addToCombatLog";
export const addToCombatLog = createAction(
  ADD_TO_COMBAT_LOG,
  action => (text: string) => action(text)
);
