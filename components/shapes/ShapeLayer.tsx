import { Layer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import RectangleShape from "./RectangleShape";
import OvalShape from "./OvalShape";
import TriangleShape from "./TriangleShape";
import StarShape from "./StarShape";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
} from "@/redux/shapeSlice";

type ShapesLayerProps = {
  objects: CanvasObjectType[];
  newObject: CanvasObjectType | null;
  onChange: (
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string,
  ) => void;
  selectedObjectId: string;
  setSelectedObjectId: (id: string) => void;
  setIsSidePanelOpen: (isVisible: boolean) => void;
};

export default function ShapeLayer({
  objects,
  newObject,
  onChange,
  selectedObjectId,
  setSelectedObjectId,
  setIsSidePanelOpen,
}: ShapesLayerProps) {
  const dispatch = useDispatch();

  const { selectedTool } = useSelector((state: RootState) => state.canvas);

  const shapes = [
    ...objects.filter((obj: CanvasObjectType) => obj.type === "shape"),
    ...(newObject && newObject.type === "shape" ? [newObject] : []),
  ];

  const renderShape = (shape: CanvasObjectType) => {
    const commonProps = {
      shapeProps: shape,
      isSelected: shape.id === selectedObjectId,
      onSelect: (e: any) => {
        if (selectedTool === "select") {
          setSelectedObjectId(shape.id);

          // Show the side panel
          setIsSidePanelOpen(true);

          // update settings to match selected shape's
          dispatch(setStrokeWidth(shape.strokeWidth || 5));
          dispatch(setStrokeColor(shape.stroke || "#2986cc"));
          dispatch(setFillColor(shape.fill || "#FFFFFF"));

          // Update cursor style
          const stage = e.target.getStage();
          if (stage) {
            const container = stage.container();
            container.style.cursor = "grab";
          }

          // TODO: #18
          // console.log("e.target =", e.target);
          // e.target.getParent().moveToTop(); // Upon select, move the object Group to top of canvas
          // e.target.moveToTop(); // Upon select, move the object to top of canvas
          // e.target.getLayer().batchDraw(); // Redraw
        }
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
