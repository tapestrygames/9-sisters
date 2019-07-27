import * as React from "react";
import { GridPosition } from "../../../../../types/GridPosition";
import { Rect } from "react-konva";

const SQUARE_SIZE = 100;

export interface GridSquareProperties {
  square: GridPosition;
  row: number;
  col: number;
}

class GridSquare extends React.Component<GridSquareProperties, any> {
  constructor(props: Readonly<GridSquareProperties>) {
    super(props);

    this.state = {};
  }

  render() {
    const { row, col, square }: GridSquareProperties  = this.props;
    return (
      <Rect
        x={SQUARE_SIZE * col}
        y={SQUARE_SIZE * row}
        width={SQUARE_SIZE}
        height={SQUARE_SIZE}
        stroke="black"
        fill={!square.open ? "black" : "#daddde"}
      />
    );
  }
}

export default GridSquare;
