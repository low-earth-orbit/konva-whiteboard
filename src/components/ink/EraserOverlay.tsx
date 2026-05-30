import { Layer, Line } from "react-konva";

type Props = {
  /** Eraser disc diameter, in canvas units. */
  size: number;
  /** Trail points [x0,y0,x1,y1,...] of the active erase stroke, canvas units. */
  trail: number[];
  isDarkMode: boolean;
};

export default function EraserOverlay({ size, trail, isDarkMode }: Props) {
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
    </Layer>
  );
}
