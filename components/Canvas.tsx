import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { Stage } from "react-konva";
import Toolbar from "./Toolbar";
import LinesLayer from "./lines/LinesLayer";
import ShapesLayer from "./shapes/ShapesLayer";
import ConfirmationDialog from "./ConfirmationDialog";
import TextFieldsLayer from "./textFields/TextFieldsLayer";
import { RootState } from "../redux/store";
import {
  addCanvasObject,
  updateCanvasObject,
  deleteCanvasObject,
  selectCanvasObject,
  resetCanvas,
  undo,
  redo,
  setCanvasObjects,
} from "../redux/canvasSlice";

export interface CanvasObjectType {
  id: string;
  type: "line" | "shape" | "text";
  tool?: ToolType;
  shapeName?: ShapeName;
  stroke?: string;
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

const isBrowser = typeof window !== "undefined";

export default function Canvas() {
  const dispatch = useDispatch();
  const { canvasObjects, selectedObjectId } = useSelector(
    (state: RootState) => state.canvas
  );

  const [stageSize, setStageSize] = useState<StageSizeType>();
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState<string>("#0000FF");
  const [width, setWidth] = useState<number>(5);
  const isFreeDrawing = useRef<boolean>(false);
  const [open, setOpen] = useState(false); // confirmation modal for delete button - clear canvas

  // load from local storage
  useEffect(() => {
    const savedState = localStorage.getItem("canvasState");
    if (savedState) {
      const canvasObjects = JSON.parse(savedState);
      dispatch(setCanvasObjects(canvasObjects));
    }
  }, [dispatch]);

  // Save state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("canvasState", JSON.stringify(canvasObjects));
  }, [canvasObjects]);

  const handleDelete = useCallback(() => {
    if (selectedObjectId === "") {
      if (canvasObjects.length > 0) {
        setOpen(true);
      }
    } else {
      dispatch(deleteCanvasObject(selectedObjectId));
    }
  }, [dispatch, selectedObjectId, canvasObjects]);

  const resetCanvasState = useCallback(() => {
    dispatch(resetCanvas());
  }, [dispatch]);

  // update browser window size
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

  // keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        handleDelete();
      } else if (
        (event.ctrlKey && event.key === "z") || // Ctrl+Z for Windows/Linux
        (event.metaKey && event.key === "z" && !event.shiftKey) // Cmd+Z for macOS
      ) {
        dispatch(undo());
      } else if (
        (event.ctrlKey && event.key === "y") || // Ctrl+Y for Windows/Linux
        (event.metaKey && event.shiftKey && event.key === "z") // Cmd+Shift+Z for macOS
      ) {
        dispatch(redo());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDelete, dispatch]);

  function updateStyle(property: keyof CanvasObjectType, value: any) {
    // Dynamically update state
    if (property === "strokeWidth") {
      setWidth(value);
    } else if (property === "stroke") {
      setColor(value);
    }

    // Update object property
    if (selectedObjectId !== "") {
      dispatch(
        updateCanvasObject({
          id: selectedObjectId,
          updates: { [property]: value },
        })
      );
    }
  }

  function updateSelectedObject(
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string
  ) {
    dispatch(updateCanvasObject({ id: selectedObjectId, updates: newAttrs }));
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
      fill: color, // use strokeColor for fill for now
      // strokeWidth not applied to text field for now
      text: "Double click to edit.",
      fontSize: 28,
      fontFamily: "Arial",
    };
    dispatch(addCanvasObject(newObject));
    dispatch(selectCanvasObject(newObjectId));
  };

  const addShape = (shapeName: ShapeName) => {
    const newShapeId = uuid();
    const baseShape = {
      id: newShapeId,
      shapeName,
      type: "shape" as const,
      stroke: color,
      strokeWidth: width,
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

    dispatch(addCanvasObject(newShape));
    dispatch(selectCanvasObject(newShapeId));
  };

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
        stroke: color,
        strokeWidth: width,
      };
      dispatch(addCanvasObject(newLine));
    } else {
      // deselect shapes when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        dispatch(selectCanvasObject(""));
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isFreeDrawing.current || selectedObjectId !== "") {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastObject = canvasObjects[canvasObjects.length - 1];

    if (lastObject.type === "line") {
      // Create a new object that copies the lastObject and updates points
      const updatedObject = {
        ...lastObject,
        points: lastObject.points!.concat([point.x, point.y]),
      };

      // Dispatch the update with the new object
      dispatch(
        updateCanvasObject({ id: lastObject.id, updates: updatedObject })
      );
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
          color={color}
          strokeWidth={width}
          stageSize={stageSize}
          isFreeDrawing={isFreeDrawing}
          selectedObjectId={selectedObjectId}
          setSelectedShapeId={(newObjectId) =>
            dispatch(selectCanvasObject(newObjectId))
          }
        />
        <TextFieldsLayer
          objects={canvasObjects}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={(newObjectId) =>
            dispatch(selectCanvasObject(newObjectId))
          }
          onChange={updateSelectedObject}
        />
      </Stage>
      <Toolbar
        objects={canvasObjects}
        setTool={setTool}
        color={color}
        onSelectColor={(newColor) => updateStyle("stroke", newColor)}
        onDelete={handleDelete}
        strokeWidth={width}
        setStrokeWidth={(newWidth) => updateStyle("strokeWidth", newWidth)}
        handleAddShape={addShape}
        handleAddTextField={addTextField}
      />
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={resetCanvasState}
        title="Clear Canvas"
        description="Are you sure you want to clear the canvas? This action cannot be undone."
      />
    </>
  );
}
