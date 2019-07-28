import { GridService } from "./grid.service";

describe("grid service", () => {
  describe("toPX", () => {
    it("should convert positions to pixels", () => {
      expect(GridService.toPx({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
      expect(GridService.toPx({ x: 1, y: 1 })).toEqual({ x: 80, y: 80 });
      expect(GridService.toPx({ x: 10, y: 5 })).toEqual({ x: 800, y: 400 });
    });

    it("should convert pixels to positions", () => {
      expect(GridService.toPosition({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
      expect(GridService.toPosition({ x: 1, y: 1 })).toEqual({ x: 0, y: 0 });
      expect(GridService.toPosition({ x: 780, y: 420 })).toEqual({
        x: 9,
        y: 5
      });
    });
  });
});
