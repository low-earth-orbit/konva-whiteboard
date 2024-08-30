import { Layer, Line } from "react-konva";
import { CanvasObjectType } from "../Canvas";

type Props = {
  objects: CanvasObjectType[];
};

export default function LinesLayer({ objects }: Props) {
  const lines = objects.filter((obj: CanvasObjectType) => obj.type === "line");

  return (
    <Layer>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line.tool === "eraser" ? "destination-out" : "source-over"
          }
        />
      ))}
    </Layer>
  );
}
