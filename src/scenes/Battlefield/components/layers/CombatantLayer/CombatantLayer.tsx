import * as React from "react";
import { Circle, Layer } from "react-konva";
import { Combatant } from "../../../types/combatant";

export interface CombatantLayerProps {
  combatants: Combatant[];
}

class CombatantLayer extends React.Component<CombatantLayerProps, any> {
  constructor(props: Readonly<CombatantLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <Layer>
        {this.props.combatants.map((combatant: Combatant) => (
          <Circle
            key={combatant.name}
            x={combatant.position.x * 80 + 40}
            y={combatant.position.y * 80 + 40}
            radius={30}
            fill={combatant.color}
          />
        ))}
      </Layer>
    );
  }
}

export default CombatantLayer;
