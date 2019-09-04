import { connect } from "react-redux";
import {
  addToCombatLog,
  clearHoveredPath,
  clearHoveredSquare,
  clearPath,
  incTurn,
  moveCombatant,
  selectNextCombatant,
  setAction,
  setHoveredPath,
  setHoveredSquare,
  setPath,
  setPhase,
  setTarget,
  updateCombatant
} from "../../store/actions";
import {
  getCombatantList,
  getCombatantPositions,
  getCombatLogEntries,
  getEnemies,
  getGrid,
  getHoveredPath,
  getHoveredSquare,
  getMatrix,
  getPhase,
  getPlayers,
  getSelectedCombatant,
  getSquares,
  getTurn
} from "../../store/selectors";
import { SistersState } from "../../store/types/SistersState";
import Battlefield from "./Battlefield";

let tick = 1;

export const BattlefieldContainer = connect(
  (state: SistersState, ownProps) => {
    try {
      const ret = {
        combatantPositions: getCombatantPositions(state),
        combatants: state.combatants,
        combatantsList: getCombatantList(state),
        enemies: getEnemies(state),
        grid: getGrid(state),
        hoveredPath: getHoveredPath(state),
        hoveredSquare: getHoveredSquare(state),
        logEntries: getCombatLogEntries(state),
        matrix: getMatrix(state),
        phase: getPhase(state),
        players: getPlayers(state),
        selectedCombatant: getSelectedCombatant(state),
        squares: getSquares(state),
        tick: tick++,
        turn: getTurn(state)
      };
      return ret;
    } catch (e) {
      console.log("ERR", e);
    }
  },
  {
    addToCombatLog,
    clearHoveredPath,
    clearHoveredSquare,
    clearPath,
    incTurn,
    moveCombatant,
    selectNextCombatant,
    setAction,
    setHoveredPath,
    setHoveredSquare,
    setPath,
    setPhase,
    setTarget,
    updateCombatant
  }
)(Battlefield);

export default BattlefieldContainer;
