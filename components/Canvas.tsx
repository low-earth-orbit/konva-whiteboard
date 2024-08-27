"use client";

import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import FreeDrawLayer from "./FreeDrawLayer";
import { v4 as uuid } from "uuid";
import { Stage } from "react-konva";
import ShapesLayer from "./ShapesLayer";

export interface LineType {
  tool: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface ShapeType {
  shapeName: string;
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  fill?: string;
  stroke: string;
  strokeWidth: number;
}

export interface StageSizeType {
  width: number;
  height: number;
}

export default function Canvas() {
  const [tool, setTool] = useState<string>("pen");
  const [lines, setLines] = useState<LineType[]>([]);
  const [shapes, setShapes] = useState<ShapeType[]>([]);

  const [strokeColor, setStrokeColor] = useState<string>("#0000FF");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);

  const [stageSize, setStageSize] = useState<StageSizeType>();

  const isFreeDrawing = useRef<boolean>(false);

  const [selectedShapeId, setSelectedShapeId] = useState<string>("");

  function updateShapeProperty(property: keyof ShapeType, value: any) {
    // Dynamically update state
    if (property === "strokeWidth") {
      setStrokeWidth(value);
    } else if (property === "stroke") {
      setStrokeColor(value);
    }

    // Update shape property
    if (selectedShapeId !== "") {
      setShapes((prevShapes) => {
        return prevShapes.map((shape) =>
          shape.id === selectedShapeId
            ? { ...shape, [property]: value } // Update the selected shape property
            : shape
        );
      });
    }
  }

  const addShape = (shapeName: string) => {
    const newShapeId = uuid();

    switch (shapeName) {
      case "rectangle":
        setShapes([
          ...shapes,
          {
            shapeName: shapeName,
            id: newShapeId,
            x: stageSize ? stageSize.width / 2 - 100 : 0,
            y: stageSize ? stageSize.height / 2 - 50 : 0,
            width: 200,
            height: 100,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
          },
        ]);
        break;

      case "ellipse":
        console.log("inside ellipse case");
        console.log("shapes = ", shapes);
        setShapes([
          ...shapes,
          {
            shapeName: shapeName,
            id: newShapeId,
            x: stageSize ? stageSize.width / 2 : 0,
            y: stageSize ? stageSize.height / 2 : 0,
            radiusX: 100,
            radiusY: 100,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
          },
        ]);
        break;

      case "line":
        setShapes([
          ...shapes,
          {
            shapeName: shapeName,
            id: newShapeId,
            points: [
              stageSize ? stageSize.width / 2 - 50 : 0,
              stageSize ? stageSize.height / 2 : 0,
              stageSize ? stageSize.width / 2 + 50 : 0,
              stageSize ? stageSize.height / 2 : 0,
            ],
            stroke: strokeColor,
            strokeWidth: strokeWidth,
          },
        ]);
        break;

      default:
        console.warn(`Unknown shapeName: ${shapeName}`);
        break;
    }

    setSelectedShapeId(newShapeId);
  };

  function resetCanvas() {
    setLines([]);
    setShapes([]);
  }

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

  // component has not finished loading the window size
  if (!stageSize) {
    return null;
  }

  const handleMouseDown = (e: any) => {
    if (selectedShapeId === "") {
      isFreeDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([
        ...lines,
        {
          tool,
          points: [pos.x, pos.y],
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        },
      ]);
    } else {
      // deselect shapes when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedShapeId("");
      }
    }
  };

  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isFreeDrawing.current || selectedShapeId !== "") {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
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
        <FreeDrawLayer
          lines={lines}
          setLines={setLines}
          tool={tool}
          color={strokeColor}
          strokeWidth={strokeWidth}
          stageSize={stageSize}
          isFreeDrawing={isFreeDrawing}
        />
        <ShapesLayer
          shapes={shapes}
          setShapes={setShapes}
          tool={tool}
          color={strokeColor}
          strokeWidth={strokeWidth}
          stageSize={stageSize}
          isFreeDrawing={isFreeDrawing}
          selectedShapeId={selectedShapeId}
          setSelectedShapeId={setSelectedShapeId}
        />
      </Stage>
      <Toolbar
        selectTool={setTool}
        color={strokeColor}
        selectColor={(newColor) => updateShapeProperty("stroke", newColor)}
        resetCanvas={resetCanvas}
        strokeWidth={strokeWidth}
        setStrokeWidth={(newWidth) =>
          updateShapeProperty("strokeWidth", newWidth)
        }
        handleAddShape={addShape}
      />
    </>
  );
}
