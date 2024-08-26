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
  id: string;
  // shapeType: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

  const [color, setColor] = useState<string>("#0000FF");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);

  const [stageSize, setStageSize] = useState<StageSizeType>();

  const isFreeDrawing = useRef<boolean>(false);

  const [selectedShapeId, setSelectedShapeId] = useState<string>("");

  const addRectangle = () => {
    setShapes([
      ...shapes,
      {
        id: uuid(),
        x: stageSize ? stageSize.width / 2 - 100 : 0,
        y: stageSize ? stageSize.height / 2 - 50 : 0,
        width: 200,
        height: 100,
        stroke: color,
        strokeWidth: strokeWidth,
      },
    ]);
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
          stroke: color,
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
        <ShapesLayer
          shapes={shapes}
          setShapes={setShapes}
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          stageSize={stageSize}
          isFreeDrawing={isFreeDrawing}
          selectedShapeId={selectedShapeId}
          setSelectedShapeId={setSelectedShapeId}
        />
        <FreeDrawLayer
          lines={lines}
          setLines={setLines}
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          stageSize={stageSize}
          isFreeDrawing={isFreeDrawing}
        />
      </Stage>
      <Toolbar
        selectTool={setTool}
        color={color}
        selectColor={setColor}
        resetCanvas={resetCanvas}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        handleAddRectangle={addRectangle}
      />
    </>
  );
}
