import { MutableRefObject } from "react";
import { Layer } from "react-konva";
import { ShapeType, StageSizeType } from "./Canvas";
import RectangleShape from "./shapes/RectangleShape";
import EllipseShape from "./shapes/EllipseShape";
import LineShape from "./shapes/LineShape";

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
  shapes,
  setShapes,
  selectedShapeId,
  setSelectedShapeId,
}: ShapesLayerProps) {
  function onShapeChange(newAttrs: Partial<ShapeType>, i: number) {
    console.log(newAttrs);
    const newShapes = shapes.slice(); // Create a shallow copy of the shapes array
    newShapes[i] = { ...newShapes[i], ...newAttrs }; // Update the specific shape with new attributes
    setShapes(newShapes);
  }

  const renderShape = (shape: ShapeType, i: number) => {
    const commonProps = {
      shapeProps: shape,
      isSelected: shape.id === selectedShapeId,
      onSelect: () => setSelectedShapeId(shape.id),
      onChange: (newAttrs: Partial<ShapeType>) => onShapeChange(newAttrs, i),
    };

    switch (shape.shapeName) {
      case "rectangle":
        return <RectangleShape key={shape.id} {...commonProps} />;
      case "ellipse":
        return <EllipseShape key={shape.id} {...commonProps} />;
      case "line":
        return <LineShape key={shape.id} {...commonProps} />;
      default:
        console.warn(`Unknown shape: ${shape.shapeName}`);
        return null;
    }
  };

  return <Layer>{shapes.map((shape, i) => renderShape(shape, i))}</Layer>;
}
