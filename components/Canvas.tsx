import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { Stage } from "react-konva";
import Toolbar from "./toolbar/Toolbar";
import InkLayer from "./ink/InkLayer";
import ShapeLayer from "./shapes/ShapeLayer";
import ConfirmationDialog from "./ConfirmationDialog";
import TextLayer from "./text/TextLayer";
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
  updateSelectedTool,
} from "../redux/canvasSlice";
import { SHAPE_DEFAULT_HEIGHT, SHAPE_DEFAULT_WIDTH } from "./shapes/shapeUtils";
import {
  getFontStyleStringFromTextStyleArray,
  getTextDecorationStringFromTextStyleArray,
  TEXT_DEFAULT_HEIGHT,
  TEXT_DEFAULT_WIDTH,
} from "./text/textUtils";
import ShapePanel from "./toolbar/ShapePanel";
import TextPanel from "./toolbar/TextPanel";
import { setStrokeColor, setStrokeWidth } from "@/redux/shapeSlice";
import { Fab } from "@mui/material";
import GitHubIcon from "./icons/GitHubIcon";
import ZoomToolbar from "./toolbar/ZoomToolbar";
import Konva from "konva";

export interface StageSizeType {
  width: number;
  height: number;
}

export interface CanvasObjectType {
  id: string;
  type: ObjectType;
  tool?: ToolType;
  shapeName?: ShapeName;
  stroke?: string; // stroke color
  strokeWidth?: number;
  fill?: string; // shape fill color / text color
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  textDecoration?: string;
  align?: string;
  lineHeight?: number;
}

export type ObjectType = "ink" | "shape" | "text";

export type ToolType =
  | "select"
  | "eraser"
  | "pen"
  | "addText"
  | "addOval"
  | "addRectangle"
  | "addTriangle"
  | "addStar";

export type ShapeName = "rectangle" | "oval" | "triangle" | "star";

export default function Canvas() {
  const [stageSize, setStageSize] = useState<StageSizeType>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const dispatch = useDispatch();
  const { canvasObjects, selectedObjectId, selectedTool } = useSelector(
    (state: RootState) => state.canvas,
  );
  const { strokeWidth, strokeColor, fillColor } = useSelector(
    (state: RootState) => state.shape,
  );

  const { textSize, textStyle, textColor, textAlignment, lineSpacing } =
    useSelector((state: RootState) => state.text);

  const [isInProgress, setIsInProgress] = useState(false);
  const [newObject, setNewObject] = useState<CanvasObjectType | null>(null); // new text/shape object to be added to the canvas

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false); // confirmation modal for delete button - clear canvas

  const [isShapePanelVisible, setShapePanelVisible] = useState(false);
  const [isTextPanelVisible, setTextPanelVisible] = useState(false);

  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level = 100%
  const stageRef = useRef<Konva.Stage | null>(null);

  // Dark mode listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkModeListener = window.matchMedia(
        "(prefers-color-scheme: dark)",
      );

      setIsDarkMode(darkModeListener.matches);

      // Listen for changes in dark mode
      const handleThemeChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };

      darkModeListener.addEventListener("change", handleThemeChange);

      return () => {
        darkModeListener.removeEventListener("change", handleThemeChange);
      };
    }
  }, []);

  // update cursor style
  useEffect(() => {
    const getCursorStyle = () => {
      const basePath = isDarkMode
        ? "/mousePointer/dark/" // Path for dark mode SVGs
        : "/mousePointer/light/"; // Path for light mode SVGs

      switch (selectedTool) {
        case "pen":
          return `url(${basePath}add.svg) 12 12, crosshair`;
        case "addText":
          return `url(${basePath}text.svg) 12 12, text`;
        case "addRectangle":
          return `url(${basePath}rectangle.svg) 12 12, pointer`;
        case "addOval":
          return `url(${basePath}oval.svg) 12 12, pointer`;
        case "eraser":
          return `url(${basePath}erase.svg) 12 12, default`;
        default:
          return "default";
      }
    };

    const resetCursor = () => {
      document.body.style.cursor = getCursorStyle();
    };

    resetCursor();

    return () => {
      document.body.style.cursor = "default";
    };
  }, [isDarkMode, selectedTool]);

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
        setConfirmationModalOpen(true);
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
      dispatch(setStrokeWidth(value)); // TODO: Ink property should separate from shape/text
    } else if (property === "stroke") {
      dispatch(setStrokeColor(value)); // TODO: Ink property should separate from shape/text
    }

    // Update object property
    if (selectedObjectId !== "") {
      dispatch(
        updateCanvasObject({
          id: selectedObjectId,
          updates: { [property]: value },
        }),
      );
    }
  }

  function updateSelectedObject(
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string,
  ) {
    dispatch(updateCanvasObject({ id: selectedObjectId, updates: newAttrs }));
  }

  const addTextField = (x: number, y: number) => {
    setShapePanelVisible(false);
    setTextPanelVisible(true);

    const newObjectId = uuid();
    let newObject: CanvasObjectType = {
      id: newObjectId,
      type: "text" as const,
      x: x,
      y: y,
      width: TEXT_DEFAULT_WIDTH,
      height: TEXT_DEFAULT_HEIGHT,
      fill: textColor,
      text: "Double click to edit.",
      fontSize: textSize,
      align: textAlignment,
      lineHeight: lineSpacing,
      fontStyle: getFontStyleStringFromTextStyleArray(textStyle),
      textDecoration: getTextDecorationStringFromTextStyleArray(textStyle),
      fontFamily: "Arial",
    };

    setNewObject(newObject);
    dispatch(selectCanvasObject(newObjectId));
  };

  const addShape = (shapeName: ShapeName, x: number, y: number) => {
    setTextPanelVisible(false);
    setShapePanelVisible(true);

    const newShapeId = uuid();
    const baseShape = {
      id: newShapeId,
      shapeName,
      type: "shape" as const,
      strokeWidth: strokeWidth,
      stroke: strokeColor,
      fill: fillColor,
      x: x,
      y: y,
      width: SHAPE_DEFAULT_WIDTH,
      height: SHAPE_DEFAULT_HEIGHT,
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
      case "triangle":
        newShape = {
          ...baseShape,
          height: 43.3, // equilateral triangle
        };
        break;
      case "star":
        newShape = {
          ...baseShape,
        };
        break;
      default:
        console.warn(`Unknown shapeName: ${shapeName}`);
        return;
    }

    setNewObject(newShape);
    dispatch(selectCanvasObject(newShapeId));
    setShapePanelVisible(true);
  };

  const handleMouseDown = (e: any) => {
    // Drawing/adding object shall begin only if no object is currently selected.
    if (!selectedObjectId) {
      // set in progress status
      setIsInProgress(true);

      // If the current selected tool is addText or add shapes
      if (selectedTool.includes("add")) {
        const pos = e.target.getStage().getRelativePointerPosition();
        const { x, y } = pos;

        // Add new object based on tool
        switch (selectedTool) {
          case "addText":
            addTextField(x, y);
            break;
          case "addRectangle":
            addShape("rectangle", x, y);
            break;
          case "addOval":
            addShape("oval", x, y);
            break;
          case "addTriangle":
            addShape("triangle", x, y);
            break;
          case "addStar":
            addShape("star", x, y);
            break;
          default:
            console.warn(`Unknown tool: ${selectedTool}`);
            return;
        }
        return;
      }

      // If the current selected tool is eraser or pen
      if (selectedTool === "eraser" || selectedTool === "pen") {
        const pos = e.target.getStage().getRelativePointerPosition();
        const newLine: CanvasObjectType = {
          id: uuid(),
          tool: selectedTool, // eraser or pen
          type: "ink",
          points: [pos.x, pos.y],
          stroke: strokeColor,
          strokeWidth:
            selectedTool === "eraser" ? Math.max(strokeWidth, 20) : strokeWidth,
        };
        setNewObject(newLine);
        return;
      }
    }

    // deselect object when clicked on empty area or clicked on an ink object (created by pen or eraser)
    if (
      e.target === e.target.getStage() ||
      e.target.attrs.name.includes("ink")
    ) {
      dispatch(selectCanvasObject(""));
    }

    // side panel
    if (
      e.target === e.target.getStage() ||
      e.target.attrs.name?.includes("ink")
    ) {
      setShapePanelVisible(false);
      setTextPanelVisible(false);
    } else if (e.target.attrs.name?.includes("text")) {
      setShapePanelVisible(false);
    } else if (e.target.attrs.name?.includes("shape")) {
      setTextPanelVisible(false);
    }
  };

  const handleMouseMove = (e: any) => {
    // Creating new text/object is in progress
    if (isInProgress && newObject && newObject.type !== "ink") {
      const stage = e.target.getStage();
      const point = stage.getRelativePointerPosition();

      const width = Math.max(Math.abs(point.x - newObject.x!) || 5);
      const height = Math.max(Math.abs(point.y - newObject.y!) || 5);

      // Update new object based on mouse position
      if (selectedTool.includes("add")) {
        setNewObject({
          ...newObject,
          width:
            newObject.shapeName === "star" ? Math.min(width, height) : width,
          height:
            newObject.shapeName === "star" ? Math.min(width, height) : height,
        });
      } else {
        console.warn(`Unknown tool: ${selectedTool}`);
      }

      return;
    }

    // Freehand drawing (eraser or pen) in progress
    if (isInProgress && newObject) {
      const stage = e.target.getStage();
      const point = stage.getRelativePointerPosition();

      const updatedObject = {
        ...newObject,
        points: newObject.points!.concat([point.x, point.y]),
      };

      setNewObject(updatedObject);
    }
  };

  const handleMouseUp = () => {
    // Add object to store upon releasing mouse
    if (isInProgress) {
      if (newObject) dispatch(addCanvasObject(newObject));

      if (selectedTool !== "pen" && selectedTool !== "eraser")
        dispatch(updateSelectedTool("select"));

      setNewObject(null);
      setIsInProgress(false);
    }
  };

  return (
    <>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        draggable={selectedTool == "select"}
      >
        <InkLayer objects={canvasObjects} newObject={newObject} />
        <ShapeLayer
          objects={canvasObjects}
          newObject={newObject}
          onChange={updateSelectedObject}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={(newObjectId) =>
            dispatch(selectCanvasObject(newObjectId))
          }
          setSidePanelVisible={setShapePanelVisible}
        />
        <TextLayer
          objects={canvasObjects}
          newObject={newObject}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={(newObjectId) =>
            dispatch(selectCanvasObject(newObjectId))
          }
          onChange={updateSelectedObject}
          setSidePanelVisible={setTextPanelVisible}
        />
      </Stage>
      <Toolbar
        objects={canvasObjects}
        color={strokeColor}
        onSelectColor={(newColor) => updateStyle("stroke", newColor)}
        onDelete={handleDelete}
        strokeWidth={strokeWidth}
        setStrokeWidth={(newWidth) => updateStyle("strokeWidth", newWidth)}
        isDarkMode={isDarkMode}
      />
      <ConfirmationDialog
        open={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={resetCanvasState}
        title="Clear Canvas"
        description="Are you sure you want to clear the canvas? This action cannot be undone."
        isDarkMode={isDarkMode}
      />
      <ShapePanel
        isOpen={isShapePanelVisible}
        onClose={() => setShapePanelVisible(false)}
        strokeWidth={strokeWidth}
        setStrokeWidth={(newWidth) => updateStyle("strokeWidth", newWidth)}
        color={strokeColor}
        onSelectColor={(newColor) => updateStyle("stroke", newColor)}
        fillColor={fillColor}
        onSelectFillColor={(newColor) => updateStyle("fill", newColor)}
      />
      <TextPanel
        isOpen={isTextPanelVisible}
        onClose={() => setTextPanelVisible(false)}
        selectedObjectId={selectedObjectId}
      />
      <Fab
        id="github-fab"
        size="small"
        variant="extended"
        aria-label="Link to GitHub repository of this project"
        style={{
          position: "fixed",
          top: "8px",
          left: "8px",
        }}
        onClick={() =>
          window.open(
            "https://github.com/low-earth-orbit/konva-whiteboard",
            "_blank",
          )
        }
      >
        <GitHubIcon sx={{ mr: 1 }} />
        View Source
      </Fab>
      <ZoomToolbar
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        stageRef={stageRef}
      />
    </>
  );
}
