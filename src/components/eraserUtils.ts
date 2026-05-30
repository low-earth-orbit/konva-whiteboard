import type Konva from "konva";
import { CanvasObjectType } from "./Canvas";

/** Shortest distance from point (px,py) to segment (ax,ay)-(bx,by). */
export function distToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/**
 * Whether an eraser disc centred at (ex,ey) with the given radius touches an
 * ink stroke's visible outline (its poly-line, padded by half the stroke width).
 * Coordinates are in canvas (relative) units.
 */
export function strokeHitsEraser(
  obj: CanvasObjectType,
  ex: number,
  ey: number,
  eraserRadius: number,
): boolean {
  const pts = obj.points;
  if (!pts || pts.length < 2) return false;
  const threshold = eraserRadius + (obj.strokeWidth ?? 0) / 2;
  if (pts.length === 2) {
    return Math.hypot(ex - pts[0], ey - pts[1]) <= threshold;
  }
  for (let i = 0; i < pts.length - 2; i += 2) {
    if (
      distToSegment(ex, ey, pts[i], pts[i + 1], pts[i + 2], pts[i + 3]) <=
      threshold
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Map a Konva node hit during eraser sampling back to the canvas object id it
 * belongs to. Shapes are named `shape-<shapeName>` with id `shape-<shapeName>-<uuid>`;
 * text nodes are named `text` with id `<uuid>`. Ink lines are handled by geometry
 * (see {@link strokeHitsEraser}) so they're ignored here.
 */
export function objectIdFromNode(node: Konva.Node): string | null {
  const name = node.name?.() ?? "";
  const id = node.id?.() ?? "";
  if (!id) return null;
  if (name === "text") return id;
  if (name.startsWith("shape-")) {
    return id.startsWith(`${name}-`) ? id.slice(name.length + 1) : null;
  }
  return null;
}

/**
 * Sample points covering the eraser disc as it travels from `prev` to `curr`
 * (both in absolute/screen coordinates). Returns the disc centre plus a ring of
 * points at `radiusPx`, repeated along the segment so fast strokes don't skip
 * shapes. Used to hit-test filled shapes/text against Konva's hit graph.
 */
export function sampleEraserDisc(
  curr: { x: number; y: number },
  radiusPx: number,
  prev: { x: number; y: number } | null,
): { x: number; y: number }[] {
  const ringN = 4;
  const points: { x: number; y: number }[] = [];

  const addDisc = (cx: number, cy: number) => {
    points.push({ x: cx, y: cy });
    for (let i = 0; i < ringN; i++) {
      const a = (i / ringN) * 2 * Math.PI;
      points.push({
        x: cx + Math.cos(a) * radiusPx,
        y: cy + Math.sin(a) * radiusPx,
      });
    }
  };

  if (prev) {
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(dist / Math.max(radiusPx, 4)));
    for (let s = 1; s <= steps; s++) {
      addDisc(prev.x + (dx * s) / steps, prev.y + (dy * s) / steps);
    }
  } else {
    addDisc(curr.x, curr.y);
  }

  return points;
}
