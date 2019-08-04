import * as React from "react";
import { Layer, Arrow } from "react-konva";
import { GridService } from "../../../services/grid.service";
import { Position } from "../../../../../shared/types/coord";
import { Combatant } from "../../../types/combatant";
import { CombatantList } from "../../../types/CombatantList";

export interface ChosenPathsLayerProps {
  combatants: CombatantList;
}

class ChosenPathsLayer extends React.Component<ChosenPathsLayerProps, any> {
  constructor(props: Readonly<ChosenPathsLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    const { combatants }: ChosenPathsLayerProps = this.props;
    return (
      <Layer>
        {combatants
          .filter(c => !!c.currentPath)
          .combatants.map(combatant => (
            <Arrow
              key={combatant.name}
              points={(combatant.currentPath as Position[]).reduce(
                (r: number[], v: Position) => {
                  const c = GridService.toPx(v,{center: true});
                  r.push(c.x, c.y);
                  return r;
                },
                []
              )}
              strokeWidth={4}
              stroke={combatant.color}
              fill={combatant.color}
              dash={[10, 5]}
              listening={false}
            />
          ))}
      </Layer>
    );
  }
}

export default ChosenPathsLayer;
