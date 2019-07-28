import * as React from "react";
import { Stage } from "react-konva";
import GridLayer from "./components/layers/GridLayer/GridLayer";
import { GridPosition } from "./types/GridPosition";

import "./Battlefield.styl";
import CombatantLayer from "./components/layers/CombatantLayer/CombatantLayer";
import { Combatant } from "./types/combatant";

interface BattlefieldState {
  positions: GridPosition[][];
  combatants: Combatant[];
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
          position: { x: 1, y: 2 }
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
    return (
      <div className="battle-field m-5">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <GridLayer positions={this.state.positions} />
          <CombatantLayer combatants={this.state.combatants} />
        </Stage>
      </div>
    );
  }
}

export default Battlefield;
