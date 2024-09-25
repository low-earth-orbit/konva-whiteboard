import React, { useEffect, useRef } from "react";
import { Group, Rect, Transformer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import Konva from "konva";
import {
  getStrokeWidth,
  SHAPE_MIN_HEIGHT,
  SHAPE_MIN_WIDTH,
} from "./shapeUtils";

type Props = {
  shapeProps: Partial<CanvasObjectType>;
  isSelected: boolean;
  onSelect: (e: any) => void;
  onChange: (newAttrs: Partial<CanvasObjectType>) => void;
};

export default function RectangleShape({
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
              width: Math.max(SHAPE_MIN_WIDTH, group.width() * scaleX),
              height: Math.max(SHAPE_MIN_HEIGHT, group.height() * scaleY),
              rotation: group.rotation(),
            });

            // Reset scale
            group.scaleX(1);
            group.scaleY(1);
          }

          trRef.current?.getLayer()?.batchDraw();
        }}
      >
        <Rect
          name={`shape-${shapeName}`}
          id={`shape-${shapeName}-${id}`}
          x={adjustedStrokeWidth! / 2}
          y={adjustedStrokeWidth! / 2}
          width={width! - adjustedStrokeWidth!}
          height={height! - adjustedStrokeWidth!}
          stroke={stroke}
          strokeWidth={adjustedStrokeWidth}
          lineJoin="round" // round corners
        />
      </Group>
      {isSelected && (
        <Transformer
          name={`shape-${shapeName}-transformer`}
          id={`shape-${shapeName}-${id}-transformer`}
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
            // Limit resize
            if (
              Math.abs(newBox.width) < SHAPE_MIN_WIDTH ||
              Math.abs(newBox.height) < SHAPE_MIN_HEIGHT
            ) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
