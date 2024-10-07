type Point = {
  x: number;
  y: number;
};

// calculate distance between two points (p1 and p2)
function distance(p1: Point, p2: Point) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// check if a point is within the eraser's radius
export function isPointInEraser(
  point: Point,
  eraserPoints: number[],
  eraserStrokeWidth: number,
) {
  for (let i = 0; i < eraserPoints.length - 2; i += 2) {
    const eraserStart = { x: eraserPoints[i], y: eraserPoints[i + 1] };
    const eraserEnd = { x: eraserPoints[i + 2], y: eraserPoints[i + 3] };

    // Distance from the point to the eraser segment
    const distToStart = distance(point, eraserStart);
    const distToEnd = distance(point, eraserEnd);

    // Check if the point is within the eraser's width
    if (
      distToStart < eraserStrokeWidth / 2 ||
      distToEnd < eraserStrokeWidth / 2
    ) {
      return true; // Point is in eraser
    }
  }
  return false; // Point is not in eraser
}
