"use client";

import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import Toolbar from "./Toolbar";

interface LineType {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
}

export default function Canvas() {
  const [tool, setTool] = useState<string>("pen");
  const [lines, setLines] = useState<LineType[]>([]);
  const [color, setColor] = useState<string>("#0000FF");
  const [strokeWidth, setStrokeWidth] = useState<number>(5);

  const isDrawing = useRef<boolean>(false);
  const [stageSize, setStageSize] = useState<{
    width: number;
    height: number;
  }>();

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        tool,
        points: [pos.x, pos.y],
        color: color,
        strokeWidth: strokeWidth,
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current) {
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
    isDrawing.current = false;
  };

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

  return (
    <div>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
      <Toolbar
        selectTool={setTool}
        color={color}
        selectColor={setColor}
        resetCanvas={() => setLines([])}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
      />
    </div>
  );
}
