import * as React from "react";
import { Stage } from "react-konva";
import { Position, Size } from "../../shared/types/coord";
import "./Battlefield.styl";
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
import { R } from "../../shared/services/R";
import CombatLog from "./components/CombatLog/CombatLog";

import SelectedCombatantHudLayer from "./components/layers/SelectedCombatantHudLayer/SelectedCombatantHudLayer";
import { connect } from "react-redux";
import {
  CombatantState,
  SistersState,
  SquareState
} from "../../store/types/SistersState";
import {
  getCombatantPositions,
  getCombatants,
  getPhase,
  getSelectedCombatant,
  getSquares
} from "../../store/selectors";
import { Square } from "./types/square";
import { addToCombatLog, moveCombatant, setPhase } from "../../store/actions";
import { Phase } from "./types/Phase";

const COMBAT_ACTION_DELAY = 300;

export interface BattlefieldProps {
  combatants: CombatantState;
  selectedCombatant?: Combatant;
  combatantPositions: CombatantPositionMap;
  squares: SquareState;
  turn: number;
  phase: number;
  logEntries: string[];
  hoveredSquare?: Square;
  hoveredPath?: Position[];
  mapSize: Size;
  squareSize: number;

  addToCombatLog: (text: string) => void;
  setPhase: (phase: Phase) => void;
  moveCombatant: (combatantId: string, position: Position) => void;
  selectCombatant: (combatantId: string) => void;
  selectNextCombatant: (combatantId: string) => void;
  clearPath: (combatantId: string) => void;
  setPath: (combatantId: string, path: Position[]) => void;
  setAction: (combatantId: string, action: CombatantAction) => void;
  setTarget: (combatantId: string, targetId: string) => void;
  clearHoveredPath: () => void;
}

class Battlefield extends React.Component<BattlefieldProps, {}> {
  private phaseLabels = [
    "Init",
    "Player Actions",
    "Enemy Actions",
    "Resolution",
    "Cleanup"
  ];

  constructor(props: BattlefieldProps) {
    super(props);
  }

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
      // next phase
      setPhase(Phase.CLEANUP);
      component.cleanup();
      return;
    }

    const action: CombatAction = queue.shift() as CombatAction;

    switch (action.action) {
      case CombatantAction.ATTACK: {
        const entry = `${action.combatant.name} [${
          action.combatant.initiative
        }] attacks ${(action.target as Combatant).name}.`;
        addToCombatLog(entry);
        break;
      }
      case CombatantAction.MOVE: {
        moveCombatant(action.combatant.name, action.to as Position);
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

    const combatant = combatants.selectedCombatant;

    if (clickedCombatant) {
      if (clickedCombatant.faction === Faction.PLAYER) {
        selectCombatant(clickedCombatant.name);
        clearPath(clickedCombatant.name);
        clearHoveredPath();
      } else {
        if (combatant && hoveredPath) {
          setAction(combatant.name, CombatantAction.ATTACK);
          setTarget(combatant.name, clickedCombatant.name);
          setPath(hoveredPath);
          selectNextCombatant(combatant.name);
        }
      }
    } else {
      if (hoveredPath && combatant) {
        combatant.action = CombatantAction.MOVE;
        combatant.currentPath = hoveredPath;
        combatant.selected = false;

        const nextCombatant = combatants.firstOrNull(
          c => !c.selected && c.faction === Faction.PLAYER && !c.currentPath
        );

        if (nextCombatant) {
          nextCombatant.selected = true;
        }
        this.setState({
          combatants: combatants
        });
      }
    }
  };

  public squareHovered = (position: Position): void => {
    const { combatants, positions }: BattlefieldProps = this.props;
    const matrix = GridService.matrix(positions);

    let hoveredPath = undefined;
    if (this.props.phase !== Phase.PLAYER_ACTIONS) {
      return;
    }

    const selectedCombatant = combatants.selectedCombatant;

    if (!selectedCombatant) return;

    const hoveredCombatant = combatants.at(position);

    selectedCombatant.action = hoveredCombatant
      ? CombatantAction.ATTACK
      : CombatantAction.MOVE;

    if (hoveredCombatant) {
      if (
        this.dist(selectedCombatant.position, position) <=
          selectedCombatant.attackRange &&
        hoveredCombatant.faction === Faction.ENEMY
      ) {
        hoveredPath = [selectedCombatant.position, position];
      }
    } else {
      const points = GridService.pathBetween(
        matrix,
        selectedCombatant.position as Position,
        position
      );
      if (points.length <= selectedCombatant.movementRate + 1) {
        hoveredPath = points;
      }
    }

    return this.setState({
      hoveredSquare: position,
      hoveredPath,
      combatants
    });
  };

  private randomMovement = (combatant: Combatant) => {
    const { combatants, positions }: BattlefieldProps = this.props;
    const matrix = GridService.matrix(positions);

    const possibleSquares: Position[] = GridService.reachableSquares(
      matrix,
      combatant.position,
      combatant.movementRate
    );

    const res = GridService.pathBetween(matrix, combatant.position, R.pick<
      Position
    >(possibleSquares) as Position);

    return res;
  };

  // states

  private init = () => {
    const { combatants }: BattlefieldProps = this.props;
    const combatant: Combatant = combatants.first(
      c => c.faction === Faction.PLAYER
    );

    combatants.update(c => {
      c.initiative = R.roll(100);
      c.selected = false;
      c.target = undefined;
      c.action = undefined;
    });
    combatant.selected = true;
    this.setState({
      combatants,
      hoveredPath: undefined,
      hoveredSquare: undefined,
      phase: Phase.PLAYER_ACTIONS
    });
  };

  public completePlayerActions = () => {
    this.setState({
      phase: Phase.ENEMY_ACTIONS
    });

    this.enemyActions();
  };

  private enemyActions = () => {
    const { combatants }: BattlefieldProps = this.props;

    combatants
      .filter(c => c.faction == Faction.ENEMY)
      .update(c => {
        c.currentPath = this.randomMovement(c);
        c.action = CombatantAction.MOVE;
      });
    this.setState(
      {
        hoveredSquare: undefined,
        phase: Phase.RESOLUTION,
        combatants
      },
      () => {
        this.resolution();
      }
    );
  };

  private resolution = () => {
    const { combatants }: BattlefieldProps = this.props;
    const actionQueue: CombatAction[] = [];

    combatants
      .filter((c: Combatant) => !!c.currentPath)
      .combatants.sort((a: Combatant, b: Combatant) =>
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
              target: combatant.target
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
    const { combatants }: BattlefieldProps = this.props;

    combatants.update(c => (c.currentPath = undefined));

    this.setState({
      combatants,
      phase: Phase.INIT,
      turn: this.props.turn + 1
    });
    this.init();
  };

  parentRef = React.createRef<HTMLDivElement>();

  public render() {
    const {
      positions,
      hoveredSquare,
      hoveredPath,
      combatants,
      turn,
      phase,
      logEntries
    }: BattlefieldProps = this.props;
    const selectedCombatant = combatants.selectedCombatant;
    const selectedCombatantPosition: Position | null = selectedCombatant
      ? selectedCombatant.position
      : null;
    const matrix = GridService.matrix(positions);

    const hoveredCombatant = hoveredSquare
      ? combatants.at(hoveredSquare)
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
            positions={this.props.positions}
            onHover={this.squareHovered}
            onClick={this.squareClicked}
            reachableSquares={reachableSquares}
            attackType={
              selectedCombatant ? selectedCombatant.attackType : undefined
            }
            combatants={combatants}
            selectedCombatant={selectedCombatant || undefined}
          />
          {selectedCombatant && (
            <MovementRangeLayer reachableSquares={reachableSquares} />
          )}
          {phase === Phase.PLAYER_ACTIONS && (
            <ChosenPathsLayer combatants={combatants} />
          )}
          <CombatantLayer combatants={this.props.combatants} />
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
          <CombatLog logEntries={logEntries} />
        </div>
      </div>
    );
  }

  private dist(c1: Position, c2: Position): number {
    return Math.abs(Math.hypot(c2.x - c1.x, c2.y - c1.y));
  }
}

export const BattlefieldContainer = connect(
  (state: SistersState, ownProps) => ({
    combatants: state.combatants,
    selectedCombatant: getSelectedCombatant(state),
    combatantPositions: getCombatantPositions(state),
    squares: getSquares(state),
    phase: getPhase(state)
  }),
  {
    addToCombatLog,
    setPhase,
    moveCombatant,
    setAction,
    setTarget,
    setPath,
    selectNextCombatant
  }
);

export default BattlefieldContainer;
