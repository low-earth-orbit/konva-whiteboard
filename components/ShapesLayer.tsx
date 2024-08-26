import { MutableRefObject, useState } from "react";
import { Stage, Layer } from "react-konva";
import { ShapeType, StageSizeType } from "./Canvas";
import Rectangle from "./shapes/Rectangle";

type ShapesLayerProps = {
  shapes: ShapeType[];
  setShapes: (newShapes: ShapeType[]) => void;
  tool: string;
  color: string;
  strokeWidth: number;
  stageSize: StageSizeType;
  isFreeDrawing: MutableRefObject<boolean>;
  selectedShapeId: string;
  setSelectedShapeId: (id: string) => void;
};

export default function ShapesLayer({
  tool,
  shapes,
  setShapes,
  color,
  strokeWidth,
  stageSize,
  isFreeDrawing,
  selectedShapeId,
  setSelectedShapeId,
}: ShapesLayerProps) {
  return (
    <Layer>
      {shapes.map((shape, i) => {
        const shapeProps = {
          id: shape.id,
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          strokeWidth: shape.strokeWidth,
          stroke: shape.stroke,
        };

        return (
          <Rectangle
            key={i}
            shapeProps={shapeProps}
            isSelected={shape.id === selectedShapeId}
            onSelect={() => {
              setSelectedShapeId(shape.id);
            }}
            onChange={(newAttrs: ShapeType) => {
              const newShapes = shapes.slice(); // deep copy
              newShapes[i] = newAttrs;
              setShapes(newShapes);
            }}
          />
        );
      })}
    </Layer>
  );
}
