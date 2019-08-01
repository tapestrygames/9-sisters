import * as React from "react";
import { Layer, Rect } from "react-konva";
import { GridService } from "../../../services/grid.service";
import { Combatant } from "../../../types/combatant";
import Portal from "../../../../../shared/components/Portal/Portal";
import PlayerHud from "../../HUDs/PlayerHud/PlayerHud";

export interface SelectedCombatantHudLayerProps {
  combatant: Combatant;
  hoveredCombatant?: Combatant|null;
  parent?: any
}

class SelectedCombatantHudLayer extends React.Component<SelectedCombatantHudLayerProps, any> {
  constructor(props: Readonly<SelectedCombatantHudLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    const {combatant, hoveredCombatant} : SelectedCombatantHudLayerProps = this.props;
    const combatantCoord = GridService.toPx(combatant.position);
    const hoveredCombatantCoord = hoveredCombatant ? GridService.toPx(hoveredCombatant.position) : {x:0,y:0};

    return (
      <Layer>
        <Portal parent={this.props.parent}>
          {!hoveredCombatant && <div style={{
            position: "absolute",
            left: combatant.position.x >= 5 ? combatantCoord.x - 200 : combatantCoord.x + 100,
            top: combatantCoord.y
          }}>
            <PlayerHud combatant={combatant}/>
          </div>}
          {hoveredCombatant && <div style={{
            position: "absolute",
            left: hoveredCombatant.position.x > 5 ? hoveredCombatantCoord.x - 200 : hoveredCombatantCoord.x + 100,
            top: hoveredCombatantCoord.y
          }}>
            <PlayerHud combatant={hoveredCombatant}/>
          </div>}
        </Portal>
      </Layer>
    );
  }
}

export default SelectedCombatantHudLayer;
