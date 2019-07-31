import * as React from "react";
import { Circle, Layer } from "react-konva";
import { Combatant } from "../../../types/combatant";
//import { Motion, spring } from "react-motion";

export type OnClickFunc = (combatant: Combatant) => void;

export interface CombatantLayerProps {
  combatants: Combatant[];
  onClick?: OnClickFunc;
}

class CombatantLayer extends React.Component<CombatantLayerProps, any> {
  constructor(props: Readonly<CombatantLayerProps>) {
    super(props);

    this.state = {};
  }

  public clickHandler(combatant: Combatant) {
    if (this.props.onClick) {
      this.props.onClick(combatant);
    }
  }

  public render() {
    return (
      <Layer>
        {this.props.combatants.map((combatant: Combatant) => (
         // <Motion style={{x: spring(combatant.position.x*80+40),y: spring(combatant.position.y*80+40)}}>
         //   {({x, y}) =>
              <Circle
            key={combatant.name}
            x={combatant.position.x*80+40}
            y={combatant.position.y*80+40}
            radius={30}
            fill={combatant.color}
            stroke="black"
            shadowEnabled={true}
            shadowColor="darkgrey"
            shadowOffsetX={5}
            shadowOffsetY={5}
            strokeWidth={combatant.selected ? 5 : 1}
            onClick={() => this.clickHandler(combatant)}
            />
        //}
        //  </Motion>
        ))}
      </Layer>
    );
  }
}

export default CombatantLayer;
