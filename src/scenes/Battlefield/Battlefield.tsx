import * as React from "react";
import { Stage } from "react-konva";
import { Position } from "../../shared/types/coord";
import "./Battlefield.styl";
import ChosenPathsLayer from "./components/layers/ChosenPathsLayer/ChosenPathsLayer";
import CombatantLayer from "./components/layers/CombatantLayer/CombatantLayer";
import GridLayer from "./components/layers/GridLayer/GridLayer";
import MovementRangeLayer from "./components/layers/MovementRangeLayer/MovementRangeLayer";
import MoveToArrowLayer from "./components/layers/MoveToArrowLayer/MoveToArrowLayer";
import { GridService } from "./services/grid.service";
import { CombatAction } from "./types/CombatAction";
import { Combatant, CombatantAction, Faction } from "./types/combatant";
import { GridPosition } from "./types/GridPosition";
import { R } from "../../shared/services/R";
import CombatLog from "./components/CombatLog/CombatLog";

import SelectedCombatantHudLayer from "./components/layers/SelectedCombatantHudLayer/SelectedCombatantHudLayer";

import { CombatantList } from "./types/CombatantList";

import { testCombatants } from "../../shared/testdata";

const COMBAT_ACTION_DELAY = 300;
export enum Phase {
  INIT,
  PLAYER_ACTIONS,
  ENEMY_ACTIONS,
  RESOLUTION,
  CLEANUP
}

export interface BattlefieldState {
  positions: GridPosition[][];
  combatants: CombatantList;
  hoveredSquare?: Position;
  hoveredPath?: Position[];
  turn: number;
  phase: Phase;
  entries: string[];
}

class Battlefield extends React.Component<{}, BattlefieldState> {
  private phaseLabels = [
    "Init",
    "Player Actions",
    "Enemy Actions",
    "Resolution",
    "Cleanup"
  ];

  constructor(props: {}) {
    super(props);

    // const open: GridPosition = { open: true };
    // const closed: GridPosition = { open: false };

    const layout: GridPosition[][] = [];

    for (let row = 0; row < 10; row++) {
      const r = [];
      for (let col = 0; col < 10; col++) {
        r.push({
          open: Math.random() <= 0.9 || (col === 1 && row === 2),
          position: { x: col, y: row }
        });
      }
      layout.push(r);
    }

    testCombatants.update(
      (combatant: Combatant) =>
        (combatant.position = GridService.findOpenPosition(
          layout,
          testCombatants,
          combatant
        ))
    );

    this.state = {
      combatants: testCombatants,
      phase: Phase.INIT,
      positions: layout,
      turn: 1,
      entries: []
    };
  }

  public componentDidMount(): void {
    this.init();
  }

  public drainCombatQueue = (component: Battlefield, queue: CombatAction[]) => {
    const { combatants, entries } = component.state;

    if (queue.length === 0) {
      // next phase
      this.setState({
        phase: Phase.CLEANUP
      });
      component.cleanup();
      return;
    }

    const action: CombatAction = queue.shift() as CombatAction;

    switch (action.action) {
      case CombatantAction.ATTACK: {
        const entry = `${action.combatant.name} [${
          action.combatant.initiative
        }] attacks ${(action.target as Combatant).name}.`;
        component.setState({
          entries: [...entries, entry]
        });
        break;
      }
      case CombatantAction.MOVE: {
        action.combatant.position.x = (action.to as Position).x;
        action.combatant.position.y = (action.to as Position).y;
        component.setState({
          combatants: combatants
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
      hoveredPath: hoveredPath
    }: BattlefieldState = this.state;

    if (this.state.phase !== Phase.PLAYER_ACTIONS) {
      return;
    }

    const clickedCombatant: Combatant | null = combatants.at(position);

    const combatant = combatants.selectedCombatant;

    if (clickedCombatant) {
      if (clickedCombatant.faction === Faction.PLAYER) {
        if (combatant) {
          combatant.selected = false;
        }
        clickedCombatant.selected = true;
        clickedCombatant.currentPath = undefined;

        return this.setState({
          combatants,
          hoveredPath: undefined
        });
      } else {
        if (combatant && hoveredPath) {
          combatant.action = CombatantAction.ATTACK;
          combatant.currentPath = hoveredPath;
          combatant.selected = false;
          combatant.target = clickedCombatant;

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
    const { combatants, positions }: BattlefieldState = this.state;
    const matrix = GridService.matrix(positions);

    let hoveredPath = undefined;
    if (this.state.phase !== Phase.PLAYER_ACTIONS) {
      return;
    }

    const selectedCombatant = combatants.selectedCombatant;

    if (!selectedCombatant) return;

    const hoveredCombatant = combatants.at(position);

    console.log("HOV", hoveredCombatant, selectedCombatant);

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
    const { combatants, positions }: BattlefieldState = this.state;
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
    const { combatants }: BattlefieldState = this.state;
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
    const { combatants }: BattlefieldState = this.state;

    combatants
      .filter(c => c.faction == Faction.ENEMY)
      .update(c => {c.currentPath = this.randomMovement(c); c.action = CombatantAction.MOVE});
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
    const { combatants }: BattlefieldState = this.state;
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
    const { combatants }: BattlefieldState = this.state;

    combatants.update(c => (c.currentPath = undefined));

    this.setState({
      combatants,
      phase: Phase.INIT,
      turn: this.state.turn + 1
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
      entries
    }: BattlefieldState = this.state;
    const selectedCombatant = combatants.selectedCombatant;
    const selectedCombatantPosition: Position | null = selectedCombatant
      ? selectedCombatant.position
      : null;
    const matrix = GridService.matrix(positions);

    const hoveredCombatant = hoveredSquare
      ? combatants.at(hoveredSquare)
      : null;
    return (
      <div
        className="battle-field m-5 flex flex-row relative"
        ref={this.parentRef}
      >
        <Stage width={800} height={800}>
          <GridLayer
            positions={this.state.positions}
            onHover={this.squareHovered}
            onClick={this.squareClicked}
          />
          {selectedCombatant && (
            <MovementRangeLayer matrix={matrix} combatant={selectedCombatant} />
          )}
          {phase === Phase.PLAYER_ACTIONS && (
            <ChosenPathsLayer combatants={combatants} />
          )}
          <CombatantLayer combatants={this.state.combatants} />
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
          <CombatLog entries={entries} />
        </div>
      </div>
    );
  }

  private dist(c1: Position, c2: Position): number {
    return Math.abs(Math.hypot(c2.x - c1.x, c2.y - c1.y));
  }
}

export default Battlefield;
