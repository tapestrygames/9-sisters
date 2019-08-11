import * as React from "react";
import { Layer } from "react-konva";
import GridSquare from "./components/GridSguare/GridSquare";
import { Position } from "../../../../../shared/types/coord";
import {
  Combatant,
  CombatantAttackType
} from "../../../types/combatant";
import { Square } from "../../../types/square";

export type OnHoverFunc = (position: Position) => void;
export type OnClickFunc = (position: Position) => void;

interface GridLayerProps {
  positions: Square[][];
  onHover?: OnHoverFunc;
  onClick?: OnClickFunc;
  selectedCombatant?: Combatant;
  reachableSquares: Position[];
  attackType?: CombatantAttackType;
}

class GridLayer extends React.Component<GridLayerProps, any> {
  constructor(props: Readonly<GridLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    const {
      onHover,
      onClick,
      positions,
      reachableSquares,
      selectedCombatant,
      attackType
    }: GridLayerProps = this.props;
    return (
      <Layer>
        {positions.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <GridSquare
              key={(rowIndex * 100 + colIndex).toString()}
              square={col}
              row={rowIndex}
              col={colIndex}
              reachable={
                reachableSquares.filter(
                  s => s.x === colIndex && s.y === rowIndex
                ).length > 0
              }
              occupied={col.occupied}
              enemy={col.enemy}
              attackType={attackType}
              inRange={
                selectedCombatant
                  ? this.dist(selectedCombatant.position, {
                      x: colIndex,
                      y: rowIndex
                    }) <= selectedCombatant.attackRange
                  : false
              }
              onClick={() => {
                if (onClick) {
                  onClick({ x: colIndex, y: rowIndex });
                }
              }}
              onHover={() => {
                if (onHover) {
                  onHover({ x: colIndex, y: rowIndex });
                }
              }}
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
