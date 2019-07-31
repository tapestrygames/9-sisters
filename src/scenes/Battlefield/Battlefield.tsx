import * as React from "react";
import { Stage } from "react-konva";
import GridLayer from "./components/layers/GridLayer/GridLayer";
import { GridPosition } from "./types/GridPosition";
import { Position } from "../../shared/types/coord";
import "./Battlefield.styl";
import CombatantLayer from "./components/layers/CombatantLayer/CombatantLayer";
import { Combatant, Faction } from "./types/combatant";
import MoveToArrowLayer from "./components/layers/MoveToArrowLayer/MoveToArrowLayer";
import { GridService } from "./services/grid.service";
import MovementRangeLayer from "./components/layers/MovementRangeLayer/MovementRangeLayer";

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
        faction: Faction.PLAYER,
        color: "blue",
        name: "Dhrami",
        position: { x: -1, y: -1 },
        selected: true,
        movement: 5,
        startingPositionRule: (position: Position) => position.y < 5
      },
      {
        faction: Faction.PLAYER,
        color: "yellow",
        name: "Moire Caubelle",
        position: { x: -1, y: -1 },
        selected: true,
        movement: 5,
        startingPositionRule: (position: Position) => position.y < 5
      },
      {
        faction: Faction.ENEMY,
        color: "green",
        name: "Troll",
        position: { x: -1, y: -1 },
        movement: 2,
        startingPositionRule: (position: Position) => position.y >= 5
      },
      {
        faction: Faction.ENEMY,
        color: "red",
        name: "Imp",
        position: { x: -1, y: -1 },
        movement: 8,
        startingPositionRule: (position: Position) => position.y >= 5
      },
      {
        faction: Faction.ENEMY,
        color: "grey",
        name: "Skeleton",
        position: { x: -1, y: -1 },
        movement: 4,
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
      combatants: combatants,
      positions: layout,
      turn: 1,
      phase: Phase.INIT
    };
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
    console.log("rendering bf", hoveredSquare, selectedCombatantPosition);
    return (
      <div className="battle-field m-5">
        <Stage width={window.innerWidth} height={window.innerHeight - 100}>
          <GridLayer
            positions={this.state.positions}
            onHover={this.squareHovered}
          />
          {selectedCombatant && (
            <MovementRangeLayer matrix={matrix} combatant={selectedCombatant} />
          )}
          {selectedCombatantPosition && (
            <MoveToArrowLayer
              matrix={matrix}
              hoveredSquare={hoveredSquare}
              selectedSquare={selectedCombatantPosition}
            />
          )}
          <CombatantLayer
            combatants={this.state.combatants}
            onClick={this.combatantClicked}
          />
        </Stage>
        <div className="flex flex-row">
          <button onClick={() => this.nextPhase()}>Next Phase</button>
          <div className="pl-3">
            {this.phaseLabels[phase]} {turn}
          </div>
        </div>
      </div>
    );
  }

  nextPhase = () => {
    this.setState({
      phase: this.state.phase === 4 ? 0 : this.state.phase + 1,
      turn: this.state.phase === 4 ? this.state.turn + 1 : this.state.turn
    });
  };

  squareHovered = (position?: Position): void =>
    this.setState({ hoveredSquare: position });

  combatantClicked = (combatant: Combatant): void =>
    this.setState({
      combatants: [
        ...this.state.combatants.map(c => ({ ...c, selected: combatant === c }))
      ]
    });
}

export default Battlefield;
