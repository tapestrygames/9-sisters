import * as React from "react";
import { Rect } from "react-konva";
import { GridPosition } from "../../../../../types/GridPosition";
import bullseye from "../../../../../../../css/images/bullseye-arrow-solid.svg";
import shoeprint from "../../../../../../../css/images/shoe-prints-regular.svg";
import times from "../../../../../../../css/images/times-solid.svg";
import sword from "../../../../../../../css/images/sword-solid.svg";
import { CombatantAttackType } from "../../../../../types/combatant";

const SQUARE_SIZE = 80;

export interface GridSquareProperties {
  square: GridPosition;
  row: number;
  col: number;
  onHover?: () => void;
  onClick?: () => void;
  reachable?: boolean;
  occupied?: boolean;
  enemy?: boolean;
  attackType?: CombatantAttackType;
  inRange?: boolean;
}

class GridSquare extends React.Component<GridSquareProperties, any> {
  constructor(props: Readonly<GridSquareProperties>) {
    super(props);

    this.state = {};
  }

  public render() {
    const { row, col, square, onHover, onClick, reachable, occupied, attackType , enemy, inRange}: GridSquareProperties = this.props;
    const icon = square.open ? (reachable ? (occupied ? (enemy ? (inRange ? (attackType === CombatantAttackType.MELEE ? sword : bullseye) : times) : times) : shoeprint) : times) : times;

    return <Rect
      x={SQUARE_SIZE * col}
      y={SQUARE_SIZE * row}
      width={SQUARE_SIZE}
      height={SQUARE_SIZE}
      stroke="black"
      onMouseEnter={() => {
        document.body.style.cursor = `url(${icon}),auto`;
      }}
      onMouseLeave={() => {
        document.body.style.cursor = "default";
      }}
      fill={!square.open ? "black" : "#daddde"}
      onMouseOver={() => {if (onHover) {onHover()}}}
      onClick={() => {if (onClick) {onClick()}}}
    />;
  }
}

export default GridSquare;

