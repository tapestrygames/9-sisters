import * as React from "react";
import { Rect } from "react-konva";
import { GridPosition } from "../../../../../types/GridPosition";

const SQUARE_SIZE = 80;

export interface GridSquareProperties {
  square: GridPosition;
  row: number;
  col: number;
  onHover?: () => void;
  onClick?: () => void;
}

class GridSquare extends React.Component<GridSquareProperties, any> {
  constructor(props: Readonly<GridSquareProperties>) {
    super(props);

    this.state = {};
  }

  public render() {
    const { row, col, square, onHover, onClick }: GridSquareProperties = this.props;
    return <Rect
      x={SQUARE_SIZE * col}
      y={SQUARE_SIZE * row}
      width={SQUARE_SIZE}
      height={SQUARE_SIZE}
      stroke="black"
      fill={!square.open ? "black" : "#daddde"}
      onMouseOver={() => {if (onHover) {onHover()}}}
      onClick={() => {if (onClick) {onClick()}}}
    />;
  }
}

export default GridSquare;
