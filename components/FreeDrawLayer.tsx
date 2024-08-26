import { MutableRefObject, useRef } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { LineType, StageSizeType } from "./Canvas";

type FreeDrawLayerProps = {
  lines: LineType[];
  setLines: (newLines: LineType[]) => void;
  tool: string;
  color: string;
  strokeWidth: number;
  stageSize: StageSizeType;
  isFreeDrawing: MutableRefObject<boolean>;
};

export default function FreeDrawLayer({ lines }: FreeDrawLayerProps) {
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
