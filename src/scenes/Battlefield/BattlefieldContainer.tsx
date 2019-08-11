import { connect } from "react-redux";
import { SistersState } from "../../store/types/SistersState";
import {
  getCombatantList,
  getCombatantPositions, getCombatLogEntries,
  getEnemies, getGrid, getHoveredPath, getHoveredSquare, getMatrix, getPhase,
  getPlayers,
  getSelectedCombatant, getSquares, getTurn
} from "../../store/selectors";
import {
  addToCombatLog, clearHoveredPath, clearHoveredSquare, clearPath, incTurn,
  moveCombatant,
  selectNextCombatant,
  setAction, setHoveredPath, setHoveredSquare,
  setPath,
  setPhase,
  setTarget, updateCombatant
} from "../../store/actions";
import Battlefield from "./Battlefield";

let tick=1;

export const BattlefieldContainer = connect(
  (state: SistersState, ownProps) => {
    try {
      const ret = {
        tick: tick++,
        combatants: state.combatants,
        combatantsList: getCombatantList(state),
        players: getPlayers(state),
        enemies: getEnemies(state),
        selectedCombatant: getSelectedCombatant(state),
        combatantPositions: getCombatantPositions(state),
        squares: getSquares(state),
        grid: getGrid(state),
        matrix: getMatrix(state),
        phase: getPhase(state),
        logEntries: getCombatLogEntries(state),
        turn: getTurn(state),
        hoveredSquare: getHoveredSquare(state),
        hoveredPath: getHoveredPath(state)
      };
      return ret;
    } catch (e) {
      console.log("ERR",e);
    }
  },
  {
    addToCombatLog,
    setPhase,
    moveCombatant,
    setAction,
    setTarget,
    setPath,
    selectNextCombatant,
    setHoveredSquare,
    clearHoveredSquare,
    setHoveredPath,
    clearHoveredPath,
    updateCombatant,
    incTurn,
    clearPath
  }
)(Battlefield);

export default BattlefieldContainer;