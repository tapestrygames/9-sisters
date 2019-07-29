import * as React from "react";
import { Rect } from "react-konva";
import { GridPosition } from "../../../../../types/GridPosition";
import { OnHoverFunc } from "../../GridLayer";

const SQUARE_SIZE = 80;

export interface GridSquareProperties {
  square: GridPosition;
  row: number;
  col: number;
  onHover?: OnHoverFunc
}

class GridSquare extends React.Component<GridSquareProperties, any> {
  constructor(props: Readonly<GridSquareProperties>) {
    super(props);

    this.state = {};
  }

  public render() {
    const { row, col, square, onHover }: GridSquareProperties = this.props;
    return <Rect
      x={SQUARE_SIZE * col}
      y={SQUARE_SIZE * row}
      width={SQUARE_SIZE}
      height={SQUARE_SIZE}
      stroke="black"
      fill={!square.open ? "black" : "#daddde"}
      onMouseOver={() => {if (onHover) onHover()}}
    />;
  }
}

export default GridSquare;
