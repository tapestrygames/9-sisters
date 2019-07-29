import * as React from "react";
import { Layer, Arrow, Rect } from "react-konva";
import { GridService } from "../../../services/grid.service";
import { Position} from "../../../../../shared/types/coord";
import { Combatant } from "../../../types/combatant";

export interface MovementRangeLayerProps {
  combatant: Combatant;
  matrix: number[][];
}

class MovementRangeLayer extends React.Component<MovementRangeLayerProps, any> {
  constructor(props: Readonly<MovementRangeLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    const {matrix, combatant} : MovementRangeLayerProps = this.props;
    const reachableSquares = GridService.reachableSquares(matrix, combatant.position, combatant.movement)
      .map((s: Position) => GridService.toPx(s));
    console.log(reachableSquares);
    return (
      <Layer>
        {reachableSquares.map((square: any, i) =>
          <Rect key={i} fill="rgba(0,0,0,.10)" x={square.x} y={square.y} width={GridService.gridSize} height={GridService.gridSize} listening={false}/>
        )}
      </Layer>
    );
  }
}

export default MovementRangeLayer;
