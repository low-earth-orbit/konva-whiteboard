import { Circle, Layer, Line } from "react-konva";

type Props = {
  /** Eraser disc diameter, in canvas units. */
  size: number;
  /** Trail points [x0,y0,x1,y1,...] of the active erase stroke, canvas units. */
  trail: number[];
  /** Current pointer position in canvas units, or null when off-canvas. */
  cursor: { x: number; y: number } | null;
  isDarkMode: boolean;
};

export default function EraserOverlay({
  size,
  trail,
  cursor,
  isDarkMode,
}: Props) {
  const radius = size / 2;
  const accent = isDarkMode ? "#f0f0f0" : "#333333";

  return (
    <Layer listening={false}>
      {trail.length >= 4 && (
        <Line
          points={trail}
          stroke={isDarkMode ? "rgba(240,240,240,0.5)" : "rgba(80,80,80,0.45)"}
          strokeWidth={size}
          lineCap="round"
          lineJoin="round"
          tension={0.4}
        />
      )}
      {cursor && (
        <Circle
          x={cursor.x}
          y={cursor.y}
          radius={radius}
          stroke={accent}
          strokeWidth={1.5}
          dash={[4, 4]}
          fill={isDarkMode ? "rgba(240,240,240,0.08)" : "rgba(0,0,0,0.05)"}
        />
      )}
    </Layer>
  );
}
