type Point = {
  x: number;
  y: number;
};

function pointToSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  const param = len_sq !== 0 ? dot / len_sq : -1;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

// check if a point is within the eraser's radius
export function isPointErased(
  point: Point,
  eraserPoints: number[],
  eraserSize: number,
) {
  for (let i = 0; i < eraserPoints.length - 2; i += 2) {
    const x1 = eraserPoints[i];
    const y1 = eraserPoints[i + 1];
    const x2 = eraserPoints[i + 2];
    const y2 = eraserPoints[i + 3];

    const distance = pointToSegmentDistance(point.x, point.y, x1, y1, x2, y2);
    if (distance <= eraserSize) {
      return true;
    }
  }
  return false;
}

export const arePointsEqual = (points1: number[], points2: number[]) => {
  if (points1.length !== points2.length) return false;
  return points1.every((point, index) => point === points2[index]);
};
