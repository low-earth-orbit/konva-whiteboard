import { Layer, Line } from "react-konva";
import { CanvasObjectType } from "../Canvas";

type Props = {
  objects: CanvasObjectType[];
  newObject: CanvasObjectType | null;
};

export default function InkLayer({ objects, newObject }: Props) {
  const lines = [
    ...objects.filter((obj: CanvasObjectType) => obj.type === "ink"),
    ...(newObject && newObject.type === "ink" ? [newObject] : []),
  ];

  return (
    <Layer>
      {lines.map((line, i) => (
        <Line
          name={line.type}
          key={i}
          points={line.points}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation="source-over"
        />
      ))}
    </Layer>
  );
}
