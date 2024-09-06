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
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  rotation?: number;
}

export interface StageSizeType {
  width: number;
  height: number;
}

export type ToolType =
  | "eraser"
  | "pen"
  | "addText"
  | "addOval"
  | "addRectangle";

export type ShapeName = "rectangle" | "oval";

export default function Canvas() {
  const dispatch = useDispatch();
  const { canvasObjects, selectedObjectId } = useSelector(
    (state: RootState) => state.canvas
  );

  const [stageSize, setStageSize] = useState<StageSizeType>();
  const [tool, setTool] = useState<ToolType>("pen");
  const [strokeColor, setStrokeColor] = useState<string>("#2986cc");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const isDrawing = useRef<boolean>(false);
  const [initialPosition, setInitialPosition] = useState<{
    x: number;
    y: number;
  }>();

  const isAddingObject = useRef<boolean>(false);
  const [newObject, setNewObject] = useState<CanvasObjectType>(); // new text/shape object to be added to the canvas

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
      if (
        event.key === "Delete" || // Del for Windows/Linux
        (event.metaKey && event.key === "Backspace") // Cmd+delete for macOS
      ) {
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

  // component has not finished loading the window size
  if (!stageSize) {
    return null;
  }

  function updateStyle(property: keyof CanvasObjectType, value: any) {
    // Dynamically update state
    if (property === "strokeWidth") {
      setStrokeWidth(value);
    } else if (property === "stroke") {
      setStrokeColor(value);
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

  const addTextField = (x: number, y: number) => {
    const newObjectId = uuid();
    let newObject: CanvasObjectType = {
      id: newObjectId,
      type: "text" as const,
      x: x,
      y: y,
      width: 10,
      height: 10,
      fill: strokeColor, // use strokeColor for fill for now
      // strokeWidth not applied to text field for now
      text: "Double click to edit.",
      fontSize: 28,
      fontFamily: "Arial",
    };

    if (tool.includes("add")) {
      setNewObject(newObject);
    } else {
      dispatch(addCanvasObject(newObject));
    }
    dispatch(selectCanvasObject(newObjectId));
  };

  const addShape = (shapeName: ShapeName, x: number, y: number) => {
    const newShapeId = uuid();
    const baseShape = {
      id: newShapeId,
      shapeName,
      type: "shape" as const,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      x: x,
      y: y,
      width: 5,
      height: 5,
    }; // common shape properties

    let newShape: CanvasObjectType;
    switch (shapeName) {
      case "rectangle":
        newShape = {
          ...baseShape,
        };
        break;
      case "oval":
        newShape = {
          ...baseShape,
        };
        break;
      default:
        console.warn(`Unknown shapeName: ${shapeName}`);
        return;
    }

    if (tool.includes("add")) {
      setNewObject(newShape);
    } else {
      dispatch(addCanvasObject(newShape));
    }
    dispatch(selectCanvasObject(newShapeId));
  };

  const handleMouseDown = (e: any) => {
    if (tool.includes("add")) {
      isAddingObject.current = true;
      const pos = e.target.getStage().getPointerPosition();
      const { x, y } = pos;
      // Memorize the initial position for the new object
      setInitialPosition({ x, y });

      // Add new object based on tool
      switch (tool) {
        case "addText":
          addTextField(x, y);
          break;
        case "addRectangle":
          addShape("rectangle", x, y);
          break;
        case "addOval":
          addShape("oval", x, y);
          break;
        default:
          console.warn(`Unknown tool: ${tool}`);
          return;
      }
      return;
    }

    if (!isAddingObject.current) {
      if (selectedObjectId === "") {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const newLine: CanvasObjectType = {
          id: uuid(),
          tool,
          type: "line",
          points: [pos.x, pos.y],
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        };
        dispatch(addCanvasObject(newLine));
      } else {
        // deselect shapes when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
          dispatch(selectCanvasObject(""));
        }
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (isAddingObject.current && newObject) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();

      const width = Math.max(point.x - newObject.x! || 5);
      const height = Math.max(point.y - newObject.y! || 5);

      // Update new object based on mouse position
      if (tool === "addRectangle" || tool === "addText" || tool === "addOval") {
        setNewObject({
          ...newObject,
          width: Math.abs(width),
          height: Math.abs(height),
        });
      } else {
        console.warn(`Unknown tool: ${tool}`);
      }

      return;
    }

    if (isDrawing.current) {
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
    }
  };

  const handleMouseUp = () => {
    // Add object to store upon releasing mouse
    if (isAddingObject.current) {
      if (newObject) dispatch(addCanvasObject(newObject));
      setNewObject(undefined);
      isAddingObject.current = false;
    }

    if (isDrawing) isDrawing.current = false;
    setTool("pen");
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
          newObject={newObject}
          onChange={updateSelectedObject}
          setColor={setStrokeColor}
          setWidth={setStrokeWidth}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={(newObjectId) =>
            dispatch(selectCanvasObject(newObjectId))
          }
        />
        <TextFieldsLayer
          objects={canvasObjects}
          newObject={newObject}
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
        color={strokeColor}
        onSelectColor={(newColor) => updateStyle("stroke", newColor)}
        onDelete={handleDelete}
        strokeWidth={strokeWidth}
        setStrokeWidth={(newWidth) => updateStyle("strokeWidth", newWidth)}
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
