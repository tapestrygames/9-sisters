import { expect } from "chai";
import { GridPosition } from "../types/GridPosition";
import { GridService } from "./grid.service";

describe("grid service", () => {
  describe("toPX", () => {
    it("should convert positions to pixels", () => {
      expect(GridService.toPx({ x: 0, y: 0 })).to.deep.equal({ x: 0, y: 0 });
      expect(GridService.toPx({ x: 1, y: 1 })).to.deep.equal({ x: 80, y: 80 });
      expect(GridService.toPx({ x: 10, y: 5 })).to.deep.equal({
        x: 800,
        y: 400
      });
    });

    it("should convert pixels to positions", () => {
      expect(GridService.toPosition({ x: 0, y: 0 })).to.deep.equal({
        x: 0,
        y: 0
      });
      expect(GridService.toPosition({ x: 1, y: 1 })).to.deep.equal({
        x: 0,
        y: 0
      });
      expect(GridService.toPosition({ x: 780, y: 420 })).to.deep.equal({
        x: 9,
        y: 5
      });
    });
  });

  describe("matrix", () => {
    it("should convert GridPositions to a matrix", () => {
      const gp: GridPosition[][] = [
        [
          { open: true, position: { x: 0, y: 0 } },
          { open: true, position: { x: 0, y: 0 } },
          { open: true, position: { x: 0, y: 0 } }
        ],
        [
          { open: true, position: { x: 0, y: 0 } },
          { open: false, position: { x: 0, y: 0 } },
          { open: true, position: { x: 0, y: 0 } }
        ],
        [
          { open: true, position: { x: 0, y: 0 } },
          { open: true, position: { x: 0, y: 0 } },
          { open: true, position: { x: 0, y: 0 } }
        ]
      ];

      expect(GridService.matrix(gp)).to.deep.equal([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ]);
    });
  });

  describe("shortest path", () => {
    let matrix: number[][] = [];

    beforeEach(() => {
      matrix = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ];
    });

    it("should calculate straight line for same row, no obstacles", () => {
      const res = GridService.pathBetween(
        matrix,
        { x: 1, y: 0 },
        { x: 4, y: 0 }
      );
      expect(res).to.deep.equal([
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 }
      ]);
    });
    it("should calculate path with diagonals ", () => {
      const res = GridService.pathBetween(
        matrix,
        { x: 1, y: 0 },
        { x: 4, y: 4 }
      );
      expect(res).to.deep.equal([
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ]);
    });
    it("should calculate straight line for same row, with obstacles", () => {
      matrix[0][3] = 1;
      const res = GridService.pathBetween(
        matrix,
        { x: 1, y: 0 },
        { x: 4, y: 0 }
      );
      expect(res).to.deep.equal([
        { x: 1, y: 0 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 4, y: 0 }
      ]);
    });
    it("should fail to calculate if blocked", () => {
      matrix[0][3] = 1;
      matrix[1][3] = 1;
      matrix[2][3] = 1;
      matrix[3][3] = 1;
      matrix[4][3] = 1;
      const res = GridService.pathBetween(
        matrix,
        { x: 1, y: 0 },
        { x: 4, y: 0 }
      );
      expect(res).to.deep.equal([]);
    });
  });
});
