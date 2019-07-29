import * as React from "react";
import { Stage } from "react-konva";
import GridLayer from "./components/layers/GridLayer/GridLayer";
import { GridPosition } from "./types/GridPosition";
import { Position } from "../../shared/types/coord";
import "./Battlefield.styl";
import CombatantLayer, { OnClickFunc } from "./components/layers/CombatantLayer/CombatantLayer";
import { Combatant } from "./types/combatant";
import MoveToArrowLayer from "./components/layers/MoveToArrowLayer/MoveToArrowLayer";
import { GridService } from "./services/grid.service";

export interface BattlefieldState {
  positions: GridPosition[][];
  combatants: Combatant[];
  hoveredSquare?: Position;
}

class Battlefield extends React.Component<{}, BattlefieldState> {
  constructor(props: {}) {
    super(props);

    // const open: GridPosition = { open: true };
    // const closed: GridPosition = { open: false };

    const layout: GridPosition[][] = [];

    for (let row = 0; row < 10; row++) {
      const r = [];
      for (let col = 0; col < 10; col++) {
        r.push({ open: Math.random() <= 0.9 || (col === 1 && row === 2) });
      }
      layout.push(r);
    }
    this.state = {
      combatants: [
        {
          color: "blue",
          name: "Player",
          position: { x: 1, y: 2 },
          selected: true
        },
        {
          color: "green",
          name: "Troll",
          position: { x: 5, y: 5 }
        },
        {
          color: "red",
          name: "Imp",
          position: { x: 9, y: 2 }
        },
        {
          color: "grey",
          name: "Skeleton",
          position: { x: 6, y: 7 }
        }
      ],
      positions: layout
    };
  }

  public render() {
      const {positions, hoveredSquare, combatants }: BattlefieldState = this.state;
      const selectedCombatant = combatants.reduce((r: Combatant | null,c: Combatant) => c.selected ? c : r,null);
      const selectedCombatantPosition: Position | null = selectedCombatant ? selectedCombatant.position : null;
      const matrix = GridService.matrix(positions);
      console.log('rendering bf',hoveredSquare,selectedCombatantPosition);
      return (<div className="battle-field m-5">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <GridLayer positions={this.state.positions} onHover={this.squareHovered}/>
          {selectedCombatantPosition && <MoveToArrowLayer matrix={matrix} hoveredSquare={hoveredSquare} selectedSquare={selectedCombatantPosition}/>}
          <CombatantLayer combatants={this.state.combatants} onClick={this.combatantClicked}/>
        </Stage>
      </div>
    );
  }

  squareHovered = (position?: Position) : void =>
    this.setState({hoveredSquare: position});

  combatantClicked = (combatant: Combatant): void =>
    this.setState({combatants: [...this.state.combatants.map(c => ({...c, selected: combatant === c}))]});
}

export default Battlefield;
