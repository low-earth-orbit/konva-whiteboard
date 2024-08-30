"use client";

import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import LinesLayer from "./lines/LinesLayer";
import { v4 as uuid } from "uuid";
import { Stage } from "react-konva";
import ShapesLayer from "./shapes/ShapesLayer";
import ConfirmationDialog from "./ConfirmationDialog";
import TextFieldsLayer from "./textFields/TextFieldsLayer";

export interface CanvasObjectType {
  id: string;
  type: "line" | "shape" | "text";
  tool?: ToolType;
  shapeName?: ShapeName;
  stroke: string;
  strokeWidth?: number;
  fill?: string;
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  rotation?: number;
}

export interface StageSizeType {
  width: number;
  height: number;
}

export type ToolType = "eraser" | "pen";

export type ShapeName = "rectangle" | "line" | "ellipse";

export default function Canvas() {
  const [stageSize, setStageSize] = useState<StageSizeType>();

  const [tool, setTool] = useState<ToolType>("pen");
  const [strokeColor, setStrokeColor] = useState<string>("#0000FF");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);

  const isFreeDrawing = useRef<boolean>(false);

  const [canvasObjects, setCanvasObjects] = useState<CanvasObjectType[]>([]);

  const [selectedObjectId, setSelectedObjectId] = useState<string>("");

  // confirmation modal for delete button - clear canvas
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Update the size on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function updateStyle(property: keyof CanvasObjectType, value: any) {
    // Dynamically update state
    if (property === "strokeWidth") {
      setStrokeWidth(value);
    } else if (property === "stroke") {
      setStrokeColor(value);
    }

    // Update object property
    if (selectedObjectId !== "") {
      setCanvasObjects((prevObjects) =>
        prevObjects.map((object) =>
          object.id === selectedObjectId
            ? { ...object, [property]: value } // Update the selected property
            : object
        )
      );
    }
  }

  function updateSelectedObject(
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string
  ) {
    setCanvasObjects((prevObjects) =>
      prevObjects.map((object: CanvasObjectType) =>
        object.id === selectedObjectId
          ? { ...object, ...newAttrs } // Merge newAttrs with the existing object
          : object
      )
    );
  }

  const addTextField = () => {
    const newObjectId = uuid();
    let newObject: CanvasObjectType = {
      id: newObjectId,
      type: "text" as const,
      x: stageSize ? stageSize.width / 2 - 250 : 0,
      y: stageSize ? stageSize.height / 2 - 100 : 0,
      width: 500,
      height: 100,
      stroke: strokeColor,
      // strokeWidth not applied to text field for now
      text: "Double click to edit.",
      fontSize: 28,
      fontFamily: "Arial",
    };
    setCanvasObjects([...canvasObjects, newObject]);
    setSelectedObjectId(newObjectId);
  };

  const addShape = (shapeName: ShapeName) => {
    const newShapeId = uuid();
    const baseShape = {
      id: newShapeId,
      shapeName,
      type: "shape" as const,
      stroke: strokeColor,
      strokeWidth,
    }; // common shape properties

    let newShape: CanvasObjectType;
    switch (shapeName) {
      case "rectangle":
        newShape = {
          ...baseShape,
          x: stageSize ? stageSize.width / 2 - 100 : 0,
          y: stageSize ? stageSize.height / 2 - 50 : 0,
          width: 200,
          height: 100,
        };
        break;
      case "ellipse":
        newShape = {
          ...baseShape,
          x: stageSize ? stageSize.width / 2 : 0,
          y: stageSize ? stageSize.height / 2 : 0,
          radiusX: 100,
          radiusY: 100,
        };
        break;
      case "line":
        newShape = {
          ...baseShape,
          points: [
            stageSize ? stageSize.width / 2 - 50 : 0,
            stageSize ? stageSize.height / 2 : 0,
            stageSize ? stageSize.width / 2 + 50 : 0,
            stageSize ? stageSize.height / 2 : 0,
          ],
        };
        break;
      default:
        console.warn(`Unknown shapeName: ${shapeName}`);
        return;
    }

    setCanvasObjects([...canvasObjects, newShape]);
    setSelectedObjectId(newShapeId);
  };

  function handleDelete() {
    if (selectedObjectId === "") {
      if (canvasObjects.length > 0) {
        setOpen(true);
      }
    } else {
      setCanvasObjects((prevObjects) =>
        prevObjects.filter((obj) => obj.id !== selectedObjectId)
      );
      setSelectedObjectId("");
    }
  }

  function resetCanvas() {
    setCanvasObjects([]);
    setSelectedObjectId("");
  }

  // component has not finished loading the window size
  if (!stageSize) {
    return null;
  }

  const handleMouseDown = (e: any) => {
    if (selectedObjectId === "") {
      isFreeDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      const newLine: CanvasObjectType = {
        id: uuid(),
        tool,
        type: "line",
        points: [pos.x, pos.y],
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      };
      setCanvasObjects([...canvasObjects, newLine]);
    } else {
      // deselect shapes when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedObjectId("");
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isFreeDrawing.current || selectedObjectId !== "") {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastObject = canvasObjects[canvasObjects.length - 1];

    if (lastObject.type === "line") {
      lastObject.points = lastObject.points!.concat([point.x, point.y]);
      setCanvasObjects(canvasObjects.concat());
    }
  };

  const handleMouseUp = () => {
    isFreeDrawing.current = false;
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
      >
        <LinesLayer objects={canvasObjects} />
        <ShapesLayer
          objects={canvasObjects}
          onChange={updateSelectedObject}
          tool={tool}
          color={strokeColor}
          strokeWidth={strokeWidth}
          stageSize={stageSize}
          isFreeDrawing={isFreeDrawing}
          selectedObjectId={selectedObjectId}
          setSelectedShapeId={setSelectedObjectId}
        />
        <TextFieldsLayer
          objects={canvasObjects}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={setSelectedObjectId}
          onChange={updateSelectedObject}
        />
      </Stage>
      <Toolbar
        objects={canvasObjects}
        setTool={setTool}
        color={strokeColor}
        onSelectColor={(newColor) => updateStyle("stroke", newColor)}
        onDelete={handleDelete}
        strokeWidth={strokeWidth}
        setStrokeWidth={(newWidth) => updateStyle("strokeWidth", newWidth)}
        handleAddShape={addShape}
        handleAddTextField={addTextField}
      />
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={resetCanvas}
        title="Clear Canvas"
        description="Are you sure you want to clear the canvas? This action cannot be undone."
      />
    </>
  );
}
