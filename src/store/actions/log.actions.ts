import { action } from "typesafe-actions";

export const ADD_TO_COMBAT_LOG = "addToCombatLog";
export const addToCombatLog = (text: string) => action(ADD_TO_COMBAT_LOG,text);
