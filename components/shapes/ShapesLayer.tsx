import { Layer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import RectangleShape from "./RectangleShape";
import OvalShape from "./OvalShape";
import TriangleShape from "./TriangleShape";
import StarShape from "./StarShape";

type ShapesLayerProps = {
  objects: CanvasObjectType[];
  newObject: CanvasObjectType | null;
  onChange: (
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string,
  ) => void;
  setColor: (newColor: string) => void;
  setWidth: (newWidth: number) => void;
  selectedObjectId: string;
  setSelectedObjectId: (id: string) => void;
};

export default function ShapesLayer({
  objects,
  newObject,
  onChange,
  setColor,
  setWidth,
  selectedObjectId,
  setSelectedObjectId,
}: ShapesLayerProps) {
  const shapes = [
    ...objects.filter((obj: CanvasObjectType) => obj.type === "shape"),
    ...(newObject && newObject.type === "shape" ? [newObject] : []),
  ];

  const renderShape = (shape: CanvasObjectType) => {
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
      case "oval":
        return <OvalShape key={shape.id} {...commonProps} />;
      case "triangle":
        return <TriangleShape key={shape.id} {...commonProps} />;
      case "star":
        return <StarShape key={shape.id} {...commonProps} />;
      default:
        console.warn(`Unknown shape: ${shape.shapeName}`);
        return null;
    }
  };

  return <Layer>{shapes.map((shape, i) => renderShape(shape))}</Layer>;
}
