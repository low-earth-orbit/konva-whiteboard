import { MutableRefObject } from "react";
import { Layer, Line } from "react-konva";
import { CanvasObjectType, StageSizeType } from "./Canvas";

type FreeDrawLayerProps = {
  objects: CanvasObjectType[];
  setLines: (newLines: CanvasObjectType[]) => void;
  tool: string;
  color: string;
  strokeWidth: number;
  stageSize: StageSizeType;
  isFreeDrawing: MutableRefObject<boolean>;
};

export default function FreeDrawLayer({ objects }: FreeDrawLayerProps) {
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
