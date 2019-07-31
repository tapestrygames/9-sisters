import * as React from "react";
import { Layer } from "react-konva";
import { GridPosition } from "../../../types/GridPosition";
import GridSquare from "./components/GridSguare/GridSquare";
import { Position} from "../../../../../shared/types/coord";

export type OnHoverFunc = (position:Position) => void;
export type OnClickFunc = (position:Position) => void;

interface GridLayerProps {
  positions: GridPosition[][];
  onHover?: OnHoverFunc;
  onClick?: OnClickFunc;
}

class GridLayer extends React.Component<GridLayerProps, any> {
  constructor(props: Readonly<GridLayerProps>) {
    super(props);

    this.state = {};
  }

  public render() {
    const { onHover, onClick, positions}: GridLayerProps = this.props;
    return (
      <Layer>
        {positions.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <GridSquare
              key={(rowIndex * 100 + colIndex).toString()}
              square={col}
              row={rowIndex}
              col={colIndex}
              onClick={() => {if (onClick) { onClick({x: colIndex, y:rowIndex})}}}
              onHover={() => {if (onHover) { onHover({x: colIndex, y: rowIndex})}}}
            />
          ))
        )}
      </Layer>
    );
  }
}

export default GridLayer;
