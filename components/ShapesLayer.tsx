import { MutableRefObject } from "react";
import { Layer } from "react-konva";
import { CanvasObjectType, StageSizeType } from "./Canvas";
import RectangleShape from "./shapes/RectangleShape";
import EllipseShape from "./shapes/EllipseShape";
import LineShape from "./shapes/LineShape";

type ShapesLayerProps = {
  objects: CanvasObjectType[];
  onChange: (
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string
  ) => void;
  tool: string;
  color: string;
  strokeWidth: number;
  stageSize: StageSizeType;
  isFreeDrawing: MutableRefObject<boolean>;
  selectedShapeId: string;
  setSelectedShapeId: (id: string) => void;
};

export default function ShapesLayer({
  objects,
  onChange,
  selectedShapeId,
  setSelectedShapeId,
}: ShapesLayerProps) {
  const shapes = objects.filter(
    (obj: CanvasObjectType) => obj.type === "shape"
  );

  const renderShape = (shape: CanvasObjectType, i: number) => {
    const commonProps = {
      shapeProps: shape,
      isSelected: shape.id === selectedShapeId,
      onSelect: () => setSelectedShapeId(shape.id),
      onChange: (newAttrs: Partial<CanvasObjectType>) =>
        onChange(newAttrs, shape.id),
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
