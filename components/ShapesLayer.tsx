import { MutableRefObject, useState } from "react";
import { Stage, Layer } from "react-konva";
import { ShapeType, StageSizeType } from "./Canvas";
import RectangleShape from "./shapes/RectangleShape";
import EllipseShape from "./shapes/EllipseShape";

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

  function onShapeChange(newAttrs: Partial<ShapeType>, i: number) {
    console.log(newAttrs);
    const newShapes = shapes.slice(); // Create a shallow copy of the shapes array
    newShapes[i] = { ...newShapes[i], ...newAttrs }; // Update the specific shape with new attributes
    setShapes(newShapes);
  }

  return (
    <Layer>
      {shapes.map((shape, i) => {
        switch (shape.shapeName) {
          case "rectangle":
            return (
              <RectangleShape
                key={shape.id}
                shapeProps={shape}
                isSelected={shape.id === selectedShapeId}
                onSelect={() => {
                  setSelectedShapeId(shape.id);
                }}
                onChange={(newAttrs: Partial<ShapeType>) =>
                  onShapeChange(newAttrs, i)
                }
              />
            );
          case "ellipse":
            return (
              <EllipseShape
                shapeProps={shape}
                key={shape.id}
                isSelected={shape.id === selectedShapeId}
                onSelect={() => {
                  setSelectedShapeId(shape.id);
                }}
                onChange={(newAttrs: Partial<ShapeType>) =>
                  onShapeChange(newAttrs, i)
                }
              />
            );
          default:
            console.warn(`Unknown shape: ${shape.shapeName}`);
            return null;
        }
      })}
    </Layer>
  );
}
