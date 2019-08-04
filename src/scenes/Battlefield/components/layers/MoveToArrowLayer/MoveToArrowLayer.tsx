import * as React from "react";
import { Arrow, Layer } from "react-konva";
import { GridService } from "../../../services/grid.service";
import { Position } from "../../../../../shared/types/coord";
import { Combatant, CombatantAction } from "../../../types/combatant";

export interface MoveToArrowLayerProps {
  hoveredPath: Position[];
  combatant: Combatant;
}

class MoveToArrowLayer extends React.Component<MoveToArrowLayerProps, any> {
  constructor(props: Readonly<MoveToArrowLayerProps>) {
    super(props);

    this.state = {};
  }

  arrowColors(action: CombatantAction): string {
    switch (action) {
      case CombatantAction.MOVE:
        return "black";
      case CombatantAction.ATTACK:
        return "red";
    }
  }

  public render() {
    const {
      hoveredPath,
      combatant
    }: MoveToArrowLayerProps = this.props;

    const points = hoveredPath.reduce((r: number[], v: Position) => {
          const c = GridService.toPx(v, {
            center: true
          });
          r.push(c.x, c.y);
          return r;
        }, []);

    return (
      <Layer>
        {hoveredPath &&
           (
            <Arrow
              points={points}
              stroke={
                this.arrowColors(combatant.action || CombatantAction.MOVE) ||
                "purple"
              }
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
