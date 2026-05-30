import { describe, expect, it } from "vitest";
import type Konva from "konva";
import { CanvasObjectType } from "./Canvas";
import {
  distToSegment,
  objectIdFromNode,
  sampleEraserDisc,
  strokeHitsEraser,
} from "./eraserUtils";

const inkObj = (points: number[], strokeWidth = 0): CanvasObjectType => ({
  id: "ink-1",
  type: "ink",
  points,
  strokeWidth,
});

// Minimal stand-in for a Konva node with name()/id() accessors.
const node = (name: string, id: string) =>
  ({ name: () => name, id: () => id }) as unknown as Konva.Node;

describe("distToSegment", () => {
  it("returns endpoint distance for a degenerate (zero-length) segment", () => {
    expect(distToSegment(3, 4, 0, 0, 0, 0)).toBeCloseTo(5);
  });

  it("returns perpendicular distance to the segment body", () => {
    expect(distToSegment(5, 3, 0, 0, 10, 0)).toBeCloseTo(3);
  });

  it("clamps to the nearest endpoint when projection falls outside", () => {
    expect(distToSegment(-3, 4, 0, 0, 10, 0)).toBeCloseTo(5);
  });
});

describe("strokeHitsEraser", () => {
  it("hits a single-point stroke within the radius", () => {
    expect(strokeHitsEraser(inkObj([10, 10]), 12, 10, 5)).toBe(true);
    expect(strokeHitsEraser(inkObj([10, 10]), 20, 10, 5)).toBe(false);
  });

  it("hits a multi-segment stroke near any segment", () => {
    const obj = inkObj([0, 0, 100, 0, 100, 100]);
    expect(strokeHitsEraser(obj, 50, 3, 5)).toBe(true); // near first segment
    expect(strokeHitsEraser(obj, 103, 50, 5)).toBe(true); // near second segment
    expect(strokeHitsEraser(obj, 50, 50, 5)).toBe(false); // far from both
  });

  it("accounts for half the stroke width in the threshold", () => {
    const thin = inkObj([0, 0, 100, 0], 0);
    const thick = inkObj([0, 0, 100, 0], 20);
    expect(strokeHitsEraser(thin, 50, 9, 4)).toBe(false);
    expect(strokeHitsEraser(thick, 50, 9, 4)).toBe(true); // 4 + 20/2 = 14 >= 9
  });

  it("returns false for missing or empty points", () => {
    expect(strokeHitsEraser({ id: "x", type: "ink" }, 0, 0, 5)).toBe(false);
  });
});

describe("objectIdFromNode", () => {
  it("extracts the uuid from a shape node", () => {
    expect(
      objectIdFromNode(node("shape-rectangle", "shape-rectangle-abc")),
    ).toBe("abc");
    expect(objectIdFromNode(node("shape-star", "shape-star-7-9-9"))).toBe(
      "7-9-9",
    );
  });

  it("returns the id directly for a text node", () => {
    expect(objectIdFromNode(node("text", "uuid-123"))).toBe("uuid-123");
  });

  it("ignores ink and unknown nodes", () => {
    expect(objectIdFromNode(node("ink", ""))).toBeNull();
    expect(objectIdFromNode(node("something", "id"))).toBeNull();
  });
});

describe("sampleEraserDisc", () => {
  it("samples centre plus ring when there is no previous point", () => {
    const pts = sampleEraserDisc({ x: 0, y: 0 }, 10, null);
    expect(pts.length).toBe(5); // centre + 4 ring points
    expect(pts[0]).toEqual({ x: 0, y: 0 });
  });

  it("interpolates extra discs along a fast stroke", () => {
    const noMove = sampleEraserDisc({ x: 0, y: 0 }, 10, { x: 0, y: 0 });
    const fastMove = sampleEraserDisc({ x: 100, y: 0 }, 10, { x: 0, y: 0 });
    expect(fastMove.length).toBeGreaterThan(noMove.length);
  });
});
