import * as React from "react";
import { Layer } from "react-konva";
import { GridPosition } from "../../../types/GridPosition";
import GridSquare from "./components/GridSguare/GridSquare";

interface GridLayerProps {
  positions: GridPosition[][];
}

class GridLayer extends React.Component<GridLayerProps, any> {
  constructor(props: Readonly<GridLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <Layer>
        {this.props.positions.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <GridSquare
              key={(rowIndex * 100 + colIndex).toString()}
              square={col}
              row={rowIndex}
              col={colIndex}
            />
          ))
        )}
      </Layer>
    );
  }
}

export default GridLayer;