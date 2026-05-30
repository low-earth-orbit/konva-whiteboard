import { useEffect, useRef, useState } from "react";
import { useComputedColorScheme } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { Stage } from "react-konva";
import Toolbar from "./toolbar/Toolbar";
import InkLayer from "./ink/InkLayer";
import EraserOverlay from "./ink/EraserOverlay";
import ObjectLayer from "./ObjectLayer";
import ConfirmationDialog from "./ConfirmationDialog";
import { RootState } from "../redux/store";
import {
  addCanvasObject,
  updateCanvasObject,
  deleteCanvasObject,
  deleteCanvasObjects,
  selectCanvasObject,
  resetCanvas,
  undo,
  redo,
  setCanvasObjects,
} from "../redux/canvasSlice";
import {
  objectIdFromNode,
  sampleEraserDisc,
  strokeHitsEraser,
} from "./eraserUtils";
import { updateSelectedTool } from "../redux/settingsSlice";
import { setTextColor } from "../redux/textSlice";
import { SHAPE_DEFAULT_HEIGHT, SHAPE_DEFAULT_WIDTH } from "./shapes/shapeUtils";
import {
  getFontStyleStringFromTextStyleArray,
  getTextDecorationStringFromTextStyleArray,
  TEXT_DEFAULT_HEIGHT,
  TEXT_DEFAULT_WIDTH,
} from "./text/textUtils";
import ZoomToolbar from "./toolbar/ZoomToolbar";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import SidePanel from "./toolbar/sidePanel/SidePanel";
import { setIsSidePanelOpen } from "@/redux/settingsSlice";

export interface StageSizeType {
  width: number;
  height: number;
}

export interface CanvasObjectType {
  id: string;
  type: ObjectType;
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
  const colorScheme = useComputedColorScheme("light");
  const isDarkMode = colorScheme === "dark";
  const dispatch = useDispatch();
  const { canvasObjects, selectedObjectId } = useSelector(
    (state: RootState) => state.canvas,
  );
  const { selectedTool } = useSelector((state: RootState) => state.settings);
  const { borderWidth, borderColor, fillColor } = useSelector(
    (state: RootState) => state.shape,
  );
  const { textSize, textStyle, textColor, textAlignment, lineSpacing } =
    useSelector((state: RootState) => state.text);
  const { inkColor, inkWidth } = useSelector((state: RootState) => state.ink);
  const { eraserSize } = useSelector((state: RootState) => state.eraser);

  const [isInProgress, setIsInProgress] = useState(false);
  const [newObject, setNewObject] = useState<CanvasObjectType | null>(null); // new text/shape object to be added to the canvas

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false); // confirmation modal for delete button - clear canvas

  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level = 100%
  const stageRef = useRef<Konva.Stage | null>(null);

  // Eraser interaction state
  const [erasingIds, setErasingIds] = useState<Set<string>>(new Set()); // objects under the active erase stroke (dimmed, deleted on release)
  const [eraserTrail, setEraserTrail] = useState<number[]>([]); // [x0,y0,...] of the active erase stroke, canvas units
  const [eraserCursor, setEraserCursor] = useState<{
    x: number;
    y: number;
  } | null>(null); // pointer position for the on-canvas eraser disc
  const erasingIdsRef = useRef<Set<string>>(new Set()); // live mirror of erasingIds, read inside rapid pointer events
  const prevErasePointRef = useRef<{ x: number; y: number } | null>(null); // previous pointer (absolute px) for segment sampling

  // Accumulate objects whose visible outline the eraser disc touches at the
  // current pointer. Ink strokes use exact geometry; filled shapes/text use
  // Konva's hit graph so detection follows the rendered outline, not the
  // bounding box. Hits stay marked until release (matching tldraw).
  function collectErasedAtPointer() {
    const stage = stageRef.current;
    if (!stage) return;
    const rel = stage.getRelativePointerPosition();
    const abs = stage.getPointerPosition();
    if (!rel || !abs) return;

    const radius = eraserSize / 2;
    const next = new Set(erasingIdsRef.current);

    // Ink strokes — precise distance-to-segment test in canvas units.
    for (const obj of canvasObjects) {
      if (obj.type === "ink" && obj.points) {
        if (strokeHitsEraser(obj, rel.x, rel.y, radius)) next.add(obj.id);
      }
    }

    // Shapes & text — sample the eraser disc against the hit graph.
    const scale = stage.scaleX() || 1;
    const samples = sampleEraserDisc(
      abs,
      radius * scale,
      prevErasePointRef.current,
    );
    for (const p of samples) {
      for (const node of stage.getAllIntersections(p)) {
        const id = objectIdFromNode(node);
        if (id) next.add(id);
      }
    }
    prevErasePointRef.current = abs;

    if (next.size !== erasingIdsRef.current.size) {
      erasingIdsRef.current = next;
      setErasingIds(next);
    }
  }

  function startErasing() {
    erasingIdsRef.current = new Set();
    prevErasePointRef.current = null;
    setErasingIds(new Set());
    const stage = stageRef.current;
    const rel = stage?.getRelativePointerPosition();
    setEraserTrail(rel ? [rel.x, rel.y] : []);
    collectErasedAtPointer();
  }

  function commitErasing() {
    const ids = [...erasingIdsRef.current];
    if (ids.length > 0) dispatch(deleteCanvasObjects(ids));
    erasingIdsRef.current = new Set();
    prevErasePointRef.current = null;
    setErasingIds(new Set());
    setEraserTrail([]);
  }

  // Sync default text color with color scheme
  useEffect(() => {
    dispatch(setTextColor(isDarkMode ? "#ffffff" : "#000000"));
  }, [isDarkMode, dispatch]);

  // update cursor style
  useEffect(() => {
    const getCursorStyle = () => {
      // Prefix with the deploy base path (e.g. "/konva-whiteboard" on GitHub
      // Pages) so the SVG cursors resolve correctly in production.
      const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const cursorPath = isDarkMode
        ? `${appBasePath}/mousePointer/dark/` // Path for dark mode SVGs
        : `${appBasePath}/mousePointer/light/`; // Path for light mode SVGs

      switch (selectedTool) {
        case "pen":
          return `url(${cursorPath}add.svg) 12 12, crosshair`;
        case "addText":
          return `url(${cursorPath}text.svg) 12 12, text`;
        case "addRectangle":
          return `url(${cursorPath}rectangle.svg) 12 12, pointer`;
        case "addOval":
          return `url(${cursorPath}oval.svg) 12 12, pointer`;
        case "addTriangle":
          return `url(${cursorPath}triangle.svg) 12 12, pointer`;
        case "addStar":
          return `url(${cursorPath}star.svg) 12 12, pointer`;
        case "eraser":
          // The eraser disc is drawn on-canvas (EraserOverlay); hide the OS cursor.
          return "none";
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

  // Disable default trackpad zoom behavior globally
  useEffect(() => {
    const disableZoomAndScroll = (e: WheelEvent) => {
      // Prevent zoom in/out triggered by ctrlKey + scroll or pinch zoom
      // allow scroll
      if (e.ctrlKey || e.deltaY < -1 || e.deltaY > 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", disableZoomAndScroll, { passive: false });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("wheel", disableZoomAndScroll);
    };
  }, []);

  function handleDelete() {
    if (selectedObjectId === "") {
      if (canvasObjects.length > 0) {
        setConfirmationModalOpen(true);
      }
    } else {
      dispatch(deleteCanvasObject(selectedObjectId));
      const stage = stageRef.current;
      if (stage) {
        const container = stage.container();
        container.style.cursor = "default";
      }
    }
  }

  function resetCanvasState() {
    dispatch(resetCanvas());
  }

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
        event.key === "Delete" ||
        (event.metaKey && event.key === "Backspace")
      ) {
        if (selectedObjectId === "") {
          if (canvasObjects.length > 0) setConfirmationModalOpen(true);
        } else {
          dispatch(deleteCanvasObject(selectedObjectId));
          const stage = stageRef.current;
          if (stage) stage.container().style.cursor = "default";
        }
      } else if (
        (event.ctrlKey && event.key === "z") ||
        (event.metaKey && event.key === "z" && !event.shiftKey)
      ) {
        dispatch(undo());
      } else if (
        (event.ctrlKey && event.key === "y") ||
        (event.metaKey && event.shiftKey && event.key === "z")
      ) {
        dispatch(redo());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedObjectId, canvasObjects, dispatch]);

  // component has not finished loading the window size
  if (!stageSize) {
    return null;
  }

  function updateSelectedObject(
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string,
  ) {
    dispatch(updateCanvasObject({ id: selectedObjectId, updates: newAttrs }));
  }

  const addTextField = (x: number, y: number) => {
    dispatch(setIsSidePanelOpen(true));

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
    dispatch(setIsSidePanelOpen(true));
    const newShapeId = uuid();
    const baseShape = {
      id: newShapeId,
      shapeName,
      type: "shape" as const,
      strokeWidth: borderWidth,
      stroke: borderColor,
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

      // If the current selected tool is pen
      if (selectedTool === "pen") {
        const pos = e.target.getStage().getRelativePointerPosition();
        const newLine: CanvasObjectType = {
          id: uuid(),
          type: "ink",
          points: [pos.x, pos.y],
          stroke: inkColor,
          strokeWidth: inkWidth,
        };
        setNewObject(newLine);
        return;
      }

      // If the current selected tool is eraser
      if (selectedTool === "eraser") {
        startErasing();
        // isInProgress stays true so handleMouseMove keeps erasing on drag
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
  };

  const handleMouseMove = (e: any) => {
    // Eraser — follow the pointer with the on-canvas disc, and while pressed
    // grow the trail and mark crossed objects.
    if (selectedTool === "eraser") {
      const stage = e.target.getStage();
      const point = stage.getRelativePointerPosition();
      if (point) setEraserCursor({ x: point.x, y: point.y });
      if (isInProgress && point) {
        setEraserTrail((prev) => [...prev, point.x, point.y]);
        collectErasedAtPointer();
      }
      return;
    }

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

    // Pen drawing in progress
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
      if (selectedTool === "eraser") {
        commitErasing();
      } else {
        if (newObject) dispatch(addCanvasObject(newObject));

        if (selectedTool !== "pen") dispatch(updateSelectedTool("select"));
      }

      setNewObject(null);
      setIsInProgress(false);
    }
  };

  function handleWheelZoom(e: KonvaEventObject<WheelEvent>): void {
    // stop default scrolling
    e.evt.preventDefault();

    const stage = stageRef.current;

    if (stage) {
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (pointer) {
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY < 0 ? 1 : -1;

        const scaleBy = 1.05; // scale factor per wheel movement
        const newScale =
          direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        const scale = Math.max(0.1, Math.min(newScale, 3)); // limit in range

        stage.scale({ x: scale, y: scale });

        const newPos = {
          x: pointer.x - mousePointTo.x * scale,
          y: pointer.y - mousePointTo.y * scale,
        };
        stage.position(newPos);

        setZoomLevel(scale);
      }
    }
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: isDarkMode ? "#1a1b1e" : "#ffffff",
        }}
      />
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onMouseLeave={() => {
          if (isInProgress && selectedTool === "eraser") commitErasing();
          setEraserCursor(null);
        }}
        onTouchStart={handleMouseDown}
        draggable={selectedTool === "select" && !selectedObjectId}
        onWheel={(e) => handleWheelZoom(e)}
      >
        <InkLayer
          objects={canvasObjects}
          newObject={newObject}
          erasingIds={selectedTool === "eraser" ? erasingIds : undefined}
        />
        <ObjectLayer
          objects={canvasObjects}
          newObject={newObject}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={(newObjectId) =>
            dispatch(selectCanvasObject(newObjectId))
          }
          onChange={updateSelectedObject}
          zoomLevel={zoomLevel}
          erasingIds={selectedTool === "eraser" ? erasingIds : undefined}
        />
        {selectedTool === "eraser" && (
          <EraserOverlay
            size={eraserSize}
            trail={eraserTrail}
            cursor={eraserCursor}
            isDarkMode={isDarkMode}
          />
        )}
      </Stage>
      <Toolbar objects={canvasObjects} onDelete={handleDelete} />
      <ConfirmationDialog
        open={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={resetCanvasState}
        title="Clear Canvas"
        description="Are you sure you want to clear the canvas? This action cannot be undone."
      />
      <SidePanel />
      <ZoomToolbar
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        stageRef={stageRef}
      />
    </>
  );
}
