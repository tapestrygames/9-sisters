import * as React from "react";
import { Layer } from "react-konva";
import { GridPosition } from "../../../types/GridPosition";
import GridSquare from "./components/GridSguare/GridSquare";
import { Position} from "../../../../../shared/types/coord";
import { CombatantList } from "../../../types/CombatantList";
import { Combatant, CombatantAttackType, Faction } from "../../../types/combatant";

export type OnHoverFunc = (position:Position) => void;
export type OnClickFunc = (position:Position) => void;

interface GridLayerProps {
  positions: GridPosition[][];
  onHover?: OnHoverFunc;
  onClick?: OnClickFunc;
  combatants: CombatantList;
  selectedCombatant?: Combatant;
  reachableSquares: Position[];
  attackType?: CombatantAttackType
}

class GridLayer extends React.Component<GridLayerProps, any> {
  constructor(props: Readonly<GridLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    const { onHover, onClick, positions, reachableSquares, combatants, selectedCombatant, attackType}: GridLayerProps = this.props;
    return (
      <Layer>
        {positions.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <GridSquare
              key={(rowIndex * 100 + colIndex).toString()}
              square={col}
              row={rowIndex}
              col={colIndex}
              reachable={reachableSquares.filter(s => s.x===colIndex && s.y===rowIndex).length>0}
              occupied={!!combatants.at({x: colIndex, y:rowIndex})}
              enemy={!!combatants.at({x: colIndex, y:rowIndex}, (c) => c.faction === Faction.ENEMY)}
              attackType={attackType}
              inRange={selectedCombatant ? this.dist(selectedCombatant.position,{x: colIndex,y: rowIndex})<=selectedCombatant.attackRange : false}
              onClick={() => {if (onClick) { onClick({x: colIndex, y:rowIndex})}}}
              onHover={() => {if (onHover) { onHover({x: colIndex, y: rowIndex})}}}
            />
          ))
        )}
      </Layer>
    );
  }
  private dist(c1: Position, c2: Position): number {
    return Math.abs(Math.hypot(c2.x - c1.x, c2.y - c1.y));
  }

}

export default GridLayer;
