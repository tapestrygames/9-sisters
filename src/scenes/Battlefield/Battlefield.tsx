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
import { CombatAction, CombatActionType } from "./types/CombatAction";
import { Combatant, Faction } from "./types/combatant";
import { GridPosition } from "./types/GridPosition";

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
  combatants: Combatant[];
  hoveredSquare?: Position;
  turn: number;
  phase: Phase;
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

    const combatants: Combatant[] = [
      {
        color: "blue",
        faction: Faction.PLAYER,
        movementRate: 5,
        name: "Dhrami",
        position: { x: -1, y: -1 },
        selected: true,
        startingPositionRule: (position: Position) => position.y < 5
      },
      {
        color: "yellow",
        faction: Faction.PLAYER,
        movementRate: 5,
        name: "Moire Caubelle",
        position: { x: -1, y: -1 },
        startingPositionRule: (position: Position) => position.y < 5
      },
      {
        color: "green",
        faction: Faction.ENEMY,
        movementRate: 2,
        name: "Troll",
        position: { x: -1, y: -1 },
        startingPositionRule: (position: Position) => position.y >= 5
      },
      {
        color: "red",
        faction: Faction.ENEMY,
        movementRate: 8,
        name: "Imp",
        position: { x: -1, y: -1 },
        startingPositionRule: (position: Position) => position.y >= 5
      },
      {
        color: "grey",
        faction: Faction.ENEMY,
        movementRate: 4,
        name: "Skeleton",
        position: { x: -1, y: -1 },
        startingPositionRule: (position: Position) => position.y >= 5
      }
    ];
    combatants.forEach(
      combatant =>
        (combatant.position = GridService.findOpenPosition(
          layout,
          combatants,
          combatant
        ))
    );

    this.state = {
      combatants,
      phase: Phase.INIT,
      positions: layout,
      turn: 1
    };
  }

  public componentDidMount(): void {
    this.init();
  }

  public render() {
    const {
      positions,
      hoveredSquare,
      combatants,
      turn,
      phase
    }: BattlefieldState = this.state;
    const selectedCombatant = combatants.reduce(
      (r: Combatant | null, c: Combatant) => (c.selected ? c : r),
      null
    );
    const selectedCombatantPosition: Position | null = selectedCombatant
      ? selectedCombatant.position
      : null;
    const matrix = GridService.matrix(positions);

    return (
      <div className="battle-field m-5">
        <Stage width={window.innerWidth} height={window.innerHeight - 100}>
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
          {selectedCombatantPosition && (
            <MoveToArrowLayer
              matrix={matrix}
              hoveredSquare={hoveredSquare}
              selectedSquare={selectedCombatantPosition}
              combatant={selectedCombatant || undefined}
            />
          )}
          <CombatantLayer
            combatants={this.state.combatants}
            onClick={this.combatantClicked}
          />
        </Stage>
        <div className="flex flex-row">
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => this.completePlayerActions()}
          >
            Go
          </button>
          <div className="pl-3">
            {this.phaseLabels[phase]} {turn}
          </div>
        </div>
      </div>
    );
  }

  public drainCombatQueue = (component: Battlefield, queue: CombatAction[]) => {
    const { combatants } = component.state;

    if (queue.length == 0) {
      // next phase
      this.setState({
        phase: Phase.CLEANUP
      });
      component.cleanup();
      return;
    }

    const action: CombatAction = queue.shift() as CombatAction;

    switch (action.action) {
      case CombatActionType.MOVE:
        component.setState({
          combatants: [
            ...combatants.map((c: Combatant) => ({
              ...c,
              position:
                c.name === action.combatant.name
                  ? (action.to as Position)
                  : c.position
            }))
          ]
        });
    }

    setTimeout(
      () => this.drainCombatQueue(component, queue),
      COMBAT_ACTION_DELAY
    );
  };

  public completePlayerActions = () => {
    this.setState({
      phase: Phase.ENEMY_ACTIONS
    });

    this.enemyActions();
  };

  public selectedCombatant = () => {
    const combatants = this.state.combatants.filter(c => c.selected);
    return combatants.length > 0 ? combatants[0] : null;
  };

  public nextCombatant = (test?: (c: Combatant) => boolean) => {
    const combatants = this.state.combatants.filter(
      c => !c.selected && (!test || test(c))
    );
    if (!combatants.length) {
      return null;
    }

    return combatants[0];
  };

  public firstCombatant = (test?: (c: Combatant) => boolean) => {
    const combatants = this.state.combatants.filter(c => !test || test(c));
    if (!combatants.length) {
      return null;
    }

    return combatants[0];
  };

  public squareClicked = (position: Position): void => {
    if (this.state.phase !== Phase.PLAYER_ACTIONS) {
      return;
    }

    const combatant = this.selectedCombatant();
    if (combatant) {
      const matrix = GridService.matrix(this.state.positions);
      const path = GridService.pathBetween(
        matrix,
        combatant.position,
        position
      );
      const nextCombatant = this.nextCombatant(
        c => c.faction === Faction.PLAYER && !c.currentPath
      );
      this.setState({
        combatants: [
          ...this.state.combatants.map(c => ({
            ...c,
            currentPath: c.name === combatant.name ? path : c.currentPath,
            selected: !!(nextCombatant && nextCombatant.name === c.name)
          }))
        ]
      });
    }
  };

  public squareHovered = (position?: Position): void => {
    if (this.state.phase !== Phase.PLAYER_ACTIONS) {
      return;
    }
    return this.setState({
      hoveredSquare: position
    });
  };

  public combatantClicked = (combatant: Combatant): void => {
    if (this.state.phase !== Phase.PLAYER_ACTIONS) {
      return;
    }

    return this.setState({
      combatants: [
        ...this.state.combatants.map(c => ({
          ...c,
          currentPath: c.name === combatant.name ? undefined : c.currentPath,
          selected:
            combatant === c && c.faction === Faction.PLAYER ? true : c.selected
        }))
      ]
    });
  };

  private cleanup = () => {
    const { combatants }: BattlefieldState = this.state;

    this.setState({
      combatants: [
        ...combatants.map((c: Combatant) => ({
          ...c,
          currentPath: undefined
        }))
      ],
      phase: Phase.INIT,
      turn: this.state.turn + 1
    });
    this.init();
  };

  private init = () => {
    const { combatants }: BattlefieldState = this.state;
    const combatant: Combatant = this.firstCombatant(
      (c: Combatant) => c.faction === Faction.PLAYER
    ) as Combatant;
    this.setState({
      combatants: [
        ...combatants.map((c: Combatant) => ({
          ...c,
          selected: c.name === combatant.name
        }))
      ],
      phase: Phase.PLAYER_ACTIONS
    });
  };

  private enemyActions = () => {
    this.setState({
      hoveredSquare: undefined,
      phase: Phase.RESOLUTION
    });
    this.resolution();
  };

  private resolution = () => {
    const { combatants }: BattlefieldState = this.state;
    const actionQueue: CombatAction[] = [];

    combatants
      .filter((c: Combatant) => c.currentPath)
      .forEach((combatant: Combatant) => {
        (combatant.currentPath as Position[]).forEach((pos: Position) => {
          actionQueue.push({
            action: CombatActionType.MOVE,
            combatant,
            to: pos
          });
        });
      });

    setTimeout(
      () => this.drainCombatQueue(this, actionQueue),
      COMBAT_ACTION_DELAY
    );
  };
}

export default Battlefield;
