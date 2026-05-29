import { describe, expect, it } from "vitest";
import {
  getStrokeWidth,
  SHAPE_DEFAULT_HEIGHT,
  SHAPE_DEFAULT_WIDTH,
  SHAPE_MIN_HEIGHT,
  SHAPE_MIN_WIDTH,
} from "./shapeUtils";

describe("getStrokeWidth", () => {
  it("returns strokeWidth when it fits within the shape", () => {
    expect(getStrokeWidth(5, 100, 100)).toBe(5);
  });

  it("clamps strokeWidth when it exceeds half the smallest dimension", () => {
    const result = getStrokeWidth(60, 100, 100);
    expect(result).toBe(50); // minStrokeWidth = max(min(100,100)/2, 1) = 50
  });

  it("returns undefined when width or height is missing", () => {
    expect(getStrokeWidth(5, undefined, undefined)).toBeUndefined();
    expect(getStrokeWidth(5, 100, undefined)).toBeUndefined();
  });

  it("respects the minimum stroke width of 1", () => {
    const result = getStrokeWidth(50, 1, 1);
    expect(result).toBe(1);
  });
});

describe("shape constants", () => {
  it("exports expected default dimensions", () => {
    expect(SHAPE_DEFAULT_WIDTH).toBe(50);
    expect(SHAPE_DEFAULT_HEIGHT).toBe(50);
    expect(SHAPE_MIN_WIDTH).toBe(5);
    expect(SHAPE_MIN_HEIGHT).toBe(5);
  });
});
