import { MutableRefObject } from "react";
import { Layer } from "react-konva";
import { CanvasObjectType, StageSizeType } from "../Canvas";
import RectangleShape from "./RectangleShape";
import EllipseShape from "./EllipseShape";
import LineShape from "./LineShape";

type ShapesLayerProps = {
  objects: CanvasObjectType[];
  onChange: (
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string
  ) => void;
  setColor: (newColor: string) => void;
  setWidth: (newWidth: number) => void;
  selectedObjectId: string;
  setSelectedObjectId: (id: string) => void;
};

export default function ShapesLayer({
  objects,
  onChange,
  setColor,
  setWidth,
  selectedObjectId,
  setSelectedObjectId,
}: ShapesLayerProps) {
  const shapes = objects.filter(
    (obj: CanvasObjectType) => obj.type === "shape"
  );

  const renderShape = (shape: CanvasObjectType, i: number) => {
    const commonProps = {
      shapeProps: shape,
      isSelected: shape.id === selectedObjectId,
      onSelect: () => {
        setSelectedObjectId(shape.id);
        setColor(shape.stroke as string);
        setWidth(shape.strokeWidth as number);
      },
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
