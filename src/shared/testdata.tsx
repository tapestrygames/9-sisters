import { CombatantList } from "../scenes/Battlefield/types/CombatantList";
import { CombatantShape, Faction } from "../scenes/Battlefield/types/combatant";
import { Position } from "./types/coord";

export const testCombatants: CombatantList = new CombatantList([
  {
    color: "blue",
    faction: Faction.PLAYER,
    movementRate: 5,
    name: "Dhrami",
    position: { x: -1, y: -1 },
    selected: true,
    shape: CombatantShape.CIRCLE,
    startingPositionRule: (position: Position) => position.y < 5
  },
  {
    color: "yellow",
    faction: Faction.PLAYER,
    movementRate: 5,
    name: "Moire Caubelle",
    position: { x: -1, y: -1 },
    shape: CombatantShape.CIRCLE,
    startingPositionRule: (position: Position) => position.y < 5
  },
  {
    color: "green",
    faction: Faction.ENEMY,
    movementRate: 2,
    name: "Troll",
    position: { x: -1, y: -1 },
    shape: CombatantShape.SQUARE,
    startingPositionRule: (position: Position) => position.y >= 5
  },
  {
    color: "red",
    faction: Faction.ENEMY,
    movementRate: 8,
    name: "Imp",
    position: { x: -1, y: -1 },
    shape: CombatantShape.SQUARE,
    startingPositionRule: (position: Position) => position.y >= 5
  },
  {
    color: "grey",
    faction: Faction.ENEMY,
    movementRate: 4,
    name: "Skeleton",
    position: { x: -1, y: -1 },
    shape: CombatantShape.SQUARE,
    startingPositionRule: (position: Position) => position.y >= 5
  }
]);
