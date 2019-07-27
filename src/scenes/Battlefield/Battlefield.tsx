import * as React from "react";
import { Stage} from 'react-konva';
import GridLayer from "./components/layers/GridLayer/GridLayer";
import {GridPosition} from "./types/GridPosition";

interface BattlefieldState {
  positions: GridPosition[][]
}

class Battlefield extends React.Component<{}, BattlefieldState> {
  constructor(props: {}) {
    super(props);

    const open: GridPosition = {open: true};
    const closed: GridPosition = {open: false};

    this.state = {
      positions: [
        [open, open, open, closed],
        [open, open, open, open],
        [open, closed, open, open],
        [closed, closed, open, open],

      ]
    }
  }

  render() {
    return <>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <GridLayer positions={this.state.positions}/>
      </Stage>
    </>;
  }
}

export default Battlefield;
