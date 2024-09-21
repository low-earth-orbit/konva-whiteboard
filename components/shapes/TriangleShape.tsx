import React, { useEffect, useRef } from "react";
import { Group, Line, Transformer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import Konva from "konva";
import { getStrokeWidth } from "./shapeUtils";

type Props = {
  shapeProps: Partial<CanvasObjectType>;
  isSelected: boolean;
  onSelect: (e: any) => void;
  onChange: (newAttrs: Partial<CanvasObjectType>) => void;
};

export default function TriangleShape({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: Props) {
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      // attach the transformer to the group
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const { shapeName, id, x, y, width, height, stroke, strokeWidth, rotation } =
    shapeProps;

  const adjustedStrokeWidth = getStrokeWidth(strokeWidth, width, height);

  // Coordinates for a triangle (equilateral triangle)
  const points = [
    0,
    0, // Top point
    width! / 2,
    height!, // Bottom-right point
    -width! / 2,
    height!, // Bottom-left point
  ];

  return (
    <>
      <Group
        ref={groupRef}
        name={`shapeGroup-${shapeName}`}
        id={`shapeGroup-${shapeName}-${id}`}
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const group = groupRef.current;

          if (group) {
            const scaleX = group.scaleX();
            const scaleY = group.scaleY();

            // Update shapeProps with the new dimensions and position
            onChange({
              ...shapeProps,
              x: group.x(),
              y: group.y(),
              width: Math.max(5, group.width() * scaleX),
              height: Math.max(5, group.height() * scaleY),
              rotation: group.rotation(),
            });

            // Reset scale
            group.scaleX(1);
            group.scaleY(1);
          }

          trRef.current?.getLayer()?.batchDraw();
        }}
      >
        <Line
          name={`shape-${shapeName}`}
          id={`shape-${shapeName}-${id}`}
          points={points}
          closed={true} // closes the shape (triangle)
          stroke={stroke}
          strokeWidth={adjustedStrokeWidth}
          lineJoin="round" // round corners
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          shouldOverdrawWholeArea
          onMouseOver={(e) => {
            const stage = e.target.getStage();
            if (stage) {
              const container = stage.container();
              container.style.cursor = "grab";
            }
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage();
            if (stage) {
              const container = stage.container();
              container.style.cursor = ""; // Reset to tool's cursor
            }
          }}
          onMouseDown={(e) => {
            const stage = e.target.getStage();
            if (stage) {
              const container = stage.container();
              container.style.cursor = "grabbing";
            }
          }}
          onMouseUp={(e) => {
            const stage = e.target.getStage();
            if (stage) {
              const container = stage.container();
              container.style.cursor = "grab";
            }
          }}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
