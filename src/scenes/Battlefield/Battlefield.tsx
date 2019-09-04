import * as React from "react";
import { Stage } from "react-konva";
import { R } from "../../shared/services/R";
import { Position, Size } from "../../shared/types/coord";
import "./Battlefield.styl";
import CombatLog from "./components/CombatLog/CombatLog";
import ChosenPathsLayer from "./components/layers/ChosenPathsLayer/ChosenPathsLayer";
import CombatantLayer from "./components/layers/CombatantLayer/CombatantLayer";
import GridLayer from "./components/layers/GridLayer/GridLayer";
import MovementRangeLayer from "./components/layers/MovementRangeLayer/MovementRangeLayer";
import MoveToArrowLayer from "./components/layers/MoveToArrowLayer/MoveToArrowLayer";
import { GridService } from "./services/grid.service";
import { CombatAction } from "./types/CombatAction";
import {
  Combatant,
  CombatantAction,
  CombatantPositionMap,
  Faction
} from "./types/combatant";

import {
  MoveCombatantPayload,
  SetActionPayload,
  SetPathPayload,
  SetTargetPayload,
  UpdateCombatantPayload
} from "../../store/actions";
import { CombatantState, SquareState } from "../../store/types/SistersState";
import SelectedCombatantHudLayer from "./components/layers/SelectedCombatantHudLayer/SelectedCombatantHudLayer";
import { Phase } from "./types/Phase";
import { Square } from "./types/square";

const COMBAT_ACTION_DELAY = 300;

export interface BattlefieldProps {
  combatants: CombatantState;
  combatantsList: Combatant[];
  players: Combatant[];
  enemies: Combatant[];
  selectedCombatant?: Combatant;
  combatantPositions: CombatantPositionMap;
  squares: SquareState;
  matrix: number[][];
  grid: Square[][];
  turn: number;
  phase: number;
  logEntries: string[];
  hoveredSquare?: Square;
  hoveredPath?: Position[];
  mapSize: Size;
  squareSize: number;
  tick?: number;

  addToCombatLog: (text: string) => void;
  setPhase: (phase: Phase) => void;
  moveCombatant: (payload: MoveCombatantPayload) => void;
  selectCombatant: (combatantId: string) => void;
  selectNextCombatant: (combatantId: string) => void;
  clearPath: (combatantId: string) => void;
  setPath: (payload: SetPathPayload) => void;
  setAction: (payload: SetActionPayload) => void;
  setTarget: (payload: SetTargetPayload) => void;
  setHoveredSquare: (hoveredSquare: Square) => void;
  clearHoveredSquare: () => void;
  setHoveredPath: (path: Position[]) => void;
  clearHoveredPath: () => void;
  updateCombatant: (payload: UpdateCombatantPayload) => void;
  incTurn: () => void;
}

class Battlefield extends React.Component<BattlefieldProps, {}> {

  public parentRef = React.createRef<HTMLDivElement>();
  private phaseLabels = [
    "Init",
    "Player Actions",
    "Enemy Actions",
    "Resolution",
    "Cleanup"
  ];

  public componentDidMount(): void {
    this.init();
  }

  public drainCombatQueue = (component: Battlefield, queue: CombatAction[]) => {
    const {
      combatants,
      addToCombatLog,
      setPhase,
      moveCombatant
    } = component.props;

    if (queue.length === 0) {
      // next timekeeperReducers
      setPhase(Phase.CLEANUP);
      component.cleanup();
      return;
    }

    const action: CombatAction = queue.shift() as CombatAction;

    switch (action.action) {
      case CombatantAction.ATTACK: {
        const entry = `${action.combatant.name} [${action.combatant.initiative}] attacks ${combatants[action.targetId as string].name}.`;
        addToCombatLog(entry);
        break;
      }
      case CombatantAction.MOVE: {
        moveCombatant({
          combatantId: action.combatant.name,
          to: action.to as Position
        });
      }
    }

    setTimeout(
      () => this.drainCombatQueue(component, queue),
      COMBAT_ACTION_DELAY
    );
  };

  public squareClicked = (position: Position): void => {
    const {
      combatants,
      selectedCombatant,
      combatantPositions,
      hoveredPath,
      selectCombatant,
      clearPath,
      clearHoveredPath,
      setAction,
      setTarget,
      setPath,
      selectNextCombatant
    }: BattlefieldProps = this.props;

    if (this.props.phase !== Phase.PLAYER_ACTIONS) {
      return;
    }

    const clickedCombatant: Combatant | null =
      combatantPositions[`(${position.x},${position.y})`];

    const combatant: Combatant | undefined = selectedCombatant;
    if (!combatant) {
      return;
    }
    const name = combatant.name;

    if (clickedCombatant) {
      if (clickedCombatant.faction === Faction.PLAYER) {
        selectCombatant(clickedCombatant.name);
        clearPath(clickedCombatant.name);
        clearHoveredPath();
      } else {
        if (combatant && hoveredPath) {
          setAction({ combatantId: name, action: CombatantAction.ATTACK });
          setTarget({ combatantId: name, targetId: clickedCombatant.name });
          setPath({ combatantId: name, path: hoveredPath });
          selectNextCombatant(name);
        }
      }
    } else {
      if (hoveredPath && combatant) {
        setAction({ combatantId: name, action: CombatantAction.MOVE });
        setPath({ combatantId: name, path: hoveredPath });
        selectNextCombatant(name);
      }
    }
  };

  public squareHovered = (position: Position): void => {
    const {
      selectedCombatant,
      combatantPositions,
      matrix,
      squares,
      phase,
      setAction,
      setHoveredPath,
      clearHoveredPath,
      setHoveredSquare
    }: BattlefieldProps = this.props;

    let hoveredPath;
    if (phase !== Phase.PLAYER_ACTIONS) {
      return;
    }

    if (!selectedCombatant) { return; }

    const hoveredCombatant =
      combatantPositions[`(${position.x},${position.y})`];

    setAction({
      combatantId: selectedCombatant.name,
      action: hoveredCombatant ? CombatantAction.ATTACK : CombatantAction.MOVE
    });

    if (hoveredCombatant) {
      if (
        this.dist(selectedCombatant.position, position) <=
          selectedCombatant.attackRange &&
        hoveredCombatant.faction === Faction.ENEMY
      ) {
        hoveredPath = [selectedCombatant.position, position];
      }
    } else {
      console.log("SC",selectedCombatant)
      const points = GridService.pathBetween(
        matrix,
        selectedCombatant.position as Position,
        position
      );
      if (points.length <= selectedCombatant.movementRate + 1) {
        hoveredPath = points;
      }
    }

    if (hoveredPath) {
      setHoveredPath(hoveredPath);
    } else {
      clearHoveredPath();
    }
    setHoveredSquare(squares.squares[`(${position.x},${position.y})`]);
  };

  public completePlayerActions = () => {
    const { setPhase } = this.props;

    setPhase(Phase.ENEMY_ACTIONS);

    this.enemyActions();
  };

  public render() {
    const {
      combatantPositions,
      combatantsList,
      matrix,
      grid,
      selectedCombatant,
      hoveredSquare,
      hoveredPath,
      turn,
      phase,
      logEntries
    }: BattlefieldProps = this.props;

    const hoveredCombatant = hoveredSquare
      ? combatantPositions[
          `(${hoveredSquare.position.x},${hoveredSquare.position.y})`
        ]
      : null;

    const reachableSquares = selectedCombatant
      ? GridService.reachableSquares(
          matrix,
          selectedCombatant.position,
          selectedCombatant.movementRate
        )
      : [];

    return (
      <div
        className="battle-field m-5 flex flex-row relative"
        ref={this.parentRef}
      >
        <Stage width={800} height={800}>
          <GridLayer
            positions={grid}
            onHover={this.squareHovered}
            onClick={this.squareClicked}
            reachableSquares={reachableSquares}
            attackType={
              selectedCombatant ? selectedCombatant.attackType : undefined
            }
            selectedCombatant={selectedCombatant || undefined}
          />
          {selectedCombatant && (
            <MovementRangeLayer reachableSquares={reachableSquares} />
          )}
          {phase === Phase.PLAYER_ACTIONS && (
            <ChosenPathsLayer combatants={combatantsList} />
          )}
          <CombatantLayer combatants={combatantsList} />
          {selectedCombatant && hoveredPath && (
            <MoveToArrowLayer
              hoveredPath={hoveredPath}
              combatant={selectedCombatant as Combatant}
            />
          )}
          {phase === Phase.PLAYER_ACTIONS && selectedCombatant && (
            <SelectedCombatantHudLayer
              combatant={selectedCombatant}
              hoveredCombatant={hoveredCombatant}
              parent={this.parentRef}
            />
          )}
        </Stage>
        <div className="flex flex-col ml-5 w-full h-full">
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => this.completePlayerActions()}
          >
            Go
          </button>
          <div className="mt-5">Turn: {turn}</div>
          <div className="mt-5">Phase: {this.phaseLabels[phase]}</div>
          <CombatLog logEntries={logEntries} />
        </div>
      </div>
    );
  }

  private randomMovement = (combatant: Combatant) => {
    const { matrix }: BattlefieldProps = this.props;

    const possibleSquares: Position[] = GridService.reachableSquares(
      matrix,
      combatant.position,
      combatant.movementRate
    );

    return GridService.pathBetween(matrix, combatant.position, R.pick<Position>(
      possibleSquares
    ) as Position);
  };

  // states

  private init = () => {
    const {
      players,
      combatantsList,
      updateCombatant,
      clearHoveredPath,
      clearHoveredSquare,
      setPhase
    }: BattlefieldProps = this.props;
    const combatant: Combatant | null = players.length > 0 ? players[0] : null;

    combatantsList.forEach((c: Combatant) => {
      updateCombatant({
        combatantId: c.name,
        data: {
          initiative: R.roll(100),
          selected: combatant && combatant.name === c.name,
          target: undefined,
          action: undefined,
          currentPath: []
        }
      });
    });
    clearHoveredPath();
    clearHoveredSquare();
    setPhase(Phase.PLAYER_ACTIONS);
  };

  private enemyActions = () => {
    const {
      enemies,
      clearHoveredSquare,
      updateCombatant,
      setPhase
    }: BattlefieldProps = this.props;

    enemies.forEach(c => {
      updateCombatant({
        combatantId: c.name,
        data: {
          currentPath: this.randomMovement(c),
          action: CombatantAction.MOVE
        }
      });
    });
    clearHoveredSquare();
    setPhase(Phase.RESOLUTION);
    window.setTimeout(() => this.resolution(), 1);
  };

  private resolution = () => {
    const { combatantsList }: BattlefieldProps = this.props;
    const actionQueue: CombatAction[] = [];

    combatantsList
      .filter((c: Combatant) => !!c.currentPath)
      .sort((a: Combatant, b: Combatant) =>
        (a.initiative || 0) < (b.initiative || 0)
          ? 1
          : (a.initiative || 0) > (b.initiative || 0)
          ? -1
          : 0
      )
      .forEach((combatant: Combatant) => {
        switch (combatant.action) {
          case CombatantAction.MOVE: {
            (combatant.currentPath as Position[]).forEach((pos: Position) => {
              actionQueue.push({
                action: CombatantAction.MOVE,
                combatant,
                to: pos
              });
            });
            break;
          }
          case CombatantAction.ATTACK: {
            actionQueue.push({
              action: CombatantAction.ATTACK,
              combatant,
              targetId: combatant.targetId
            });
            break;
          }
        }
      });
    setTimeout(
      () => this.drainCombatQueue(this, actionQueue),
      COMBAT_ACTION_DELAY
    );
  };

  private cleanup = () => {
    const {
      combatantsList,
      clearPath,
      incTurn,
      setPhase
    }: BattlefieldProps = this.props;

    combatantsList.forEach(({ name }) => clearPath(name));
    setPhase(Phase.INIT);
    incTurn();
    this.init();
  };

  private dist(c1: Position, c2: Position): number {
    return Math.abs(Math.hypot(c2.x - c1.x, c2.y - c1.y));
  }
}

export default Battlefield;
