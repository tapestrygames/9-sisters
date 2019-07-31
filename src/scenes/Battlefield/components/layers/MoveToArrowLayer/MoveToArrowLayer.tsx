import * as React from "react";
import { Layer, Arrow } from "react-konva";
import { GridService } from "../../../services/grid.service";
import { Position } from "../../../../../shared/types/coord";
import { Combatant } from "../../../types/combatant";

export interface MoveToArrowLayerProps {
  hoveredSquare?: Position;
  selectedSquare?: Position;
  combatant?: Combatant;
  matrix: number[][];
}

class MoveToArrowLayer extends React.Component<MoveToArrowLayerProps, any> {
  constructor(props: Readonly<MoveToArrowLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    const {
      matrix,
      selectedSquare,
      hoveredSquare,
      combatant
    }: MoveToArrowLayerProps = this.props;
    const points =
      selectedSquare && hoveredSquare
        ? GridService.pathBetween(
            matrix,
            selectedSquare as Position,
            hoveredSquare
          ).reduce((r: number[], v: Position) => {
            const c = GridService.toPx(v, {
              center: true
            });
            r.push(c.x, c.y);
            return r;
          }, [])
        : null;
    return (
      <Layer>
        {points && combatant && points.length <= (combatant.movementRate + 1)*2 && (
          <Arrow
            points={points}
            stroke="black"
            strokeWidth={4}
            lineJoin={"round"}
            listening={false}
          />
        )}
      </Layer>
    );
  }
}

export default MoveToArrowLayer;
