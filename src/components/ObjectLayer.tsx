"use client";

import { Layer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { CanvasObjectType } from "./Canvas";
import { RootState } from "@/redux/store";
import { moveObjectToTop, updateCanvasObject } from "@/redux/canvasSlice";
import {
  setBorderColor,
  setBorderWidth,
  setFillColor,
} from "@/redux/shapeSlice";
import {
  setLineSpacing,
  setTextAlignment,
  setTextColor,
  setTextSize,
  setTextStyle,
} from "@/redux/textSlice";
import { setIsSidePanelOpen } from "@/redux/settingsSlice";
import { convertTextPropertiesToTextStyleArray } from "./text/textUtils";
import RectangleShape from "./shapes/RectangleShape";
import OvalShape from "./shapes/OvalShape";
import TriangleShape from "./shapes/TriangleShape";
import StarShape from "./shapes/StarShape";
import TextField from "./text/TextField";

type Props = {
  objects: CanvasObjectType[];
  newObject: CanvasObjectType | null;
  selectedObjectId: string;
  setSelectedObjectId: (id: string) => void;
  onChange: (newAttrs: Partial<CanvasObjectType>, id: string) => void;
  zoomLevel: number;
};

export default function ObjectLayer({
  objects,
  newObject,
  selectedObjectId,
  setSelectedObjectId,
  onChange,
  zoomLevel,
}: Props) {
  const dispatch = useDispatch();
  const { selectedTool } = useSelector((state: RootState) => state.settings);

  const renderableObjects = [
    ...objects.filter((o) => o.type === "shape" || o.type === "text"),
    ...(newObject && (newObject.type === "shape" || newObject.type === "text")
      ? [newObject]
      : []),
  ];

  const handleShapeSelect = (shape: CanvasObjectType, e: any) => {
    if (selectedTool !== "select") return;
    setSelectedObjectId(shape.id);
    dispatch(setIsSidePanelOpen(true));
    dispatch(setBorderWidth(shape.strokeWidth || 5));
    dispatch(setBorderColor(shape.stroke || "#2986cc"));
    dispatch(setFillColor(shape.fill || "#FFFFFF"));
    dispatch(moveObjectToTop(shape.id));
    e.target.getParent().moveToTop();
    e.target.getLayer()?.batchDraw();

    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = "grab";
  };

  const handleTextSelect = (text: CanvasObjectType, e: any) => {
    if (selectedTool !== "select") return;
    setSelectedObjectId(text.id);
    dispatch(setIsSidePanelOpen(true));
    dispatch(setTextSize(text.fontSize || 28));
    dispatch(setTextColor(text.fill || "#000"));
    dispatch(setTextAlignment(text.align || "left"));
    dispatch(setLineSpacing(text.lineHeight || 1.5));
    dispatch(
      setTextStyle(
        convertTextPropertiesToTextStyleArray(
          text.fontStyle,
          text.textDecoration,
        ),
      ),
    );
    dispatch(moveObjectToTop(text.id));
    e.target.moveToTop();
    e.target.getLayer()?.batchDraw();

    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = "grab";
  };

  const renderObject = (obj: CanvasObjectType) => {
    const shapeCommonProps = {
      shapeProps: obj,
      isSelected: obj.id === selectedObjectId,
      onSelect: (e: any) => handleShapeSelect(obj, e),
      onChange: (newAttrs: Partial<CanvasObjectType>) =>
        onChange(newAttrs, obj.id),
    };

    switch (obj.type) {
      case "shape":
        switch (obj.shapeName) {
          case "rectangle":
            return <RectangleShape key={obj.id} {...shapeCommonProps} />;
          case "oval":
            return <OvalShape key={obj.id} {...shapeCommonProps} />;
          case "triangle":
            return <TriangleShape key={obj.id} {...shapeCommonProps} />;
          case "star":
            return <StarShape key={obj.id} {...shapeCommonProps} />;
          default:
            return null;
        }
      case "text":
        return (
          <TextField
            key={obj.id}
            objectProps={obj}
            isSelected={obj.id === selectedObjectId}
            onSelect={(e) => handleTextSelect(obj, e)}
            onChange={(newAttrs) => {
              dispatch(updateCanvasObject({ id: obj.id, updates: newAttrs }));
            }}
            zoomLevel={zoomLevel}
          />
        );
      default:
        return null;
    }
  };

  return <Layer>{renderableObjects.map(renderObject)}</Layer>;
}
