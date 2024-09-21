import React, { useEffect, useRef } from "react";
import { Ellipse, Group, Transformer } from "react-konva";
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

export default function OvalShape({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: Props) {
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      // we need to attach transformer manually
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

            const newWidth = Math.max(SHAPE_MIN_WIDTH, group.width() * scaleX);
            const newHeight = Math.max(
              SHAPE_MIN_HEIGHT,
              group.height() * scaleY,
            );

            // Update shapeProps with the new dimensions and position
            onChange({
              ...shapeProps,
              x: group.x(),
              y: group.y(),
              width: newWidth,
              height: newHeight,
              rotation: group.rotation(),
            });

            // Reset scale
            group.scaleX(1);
            group.scaleY(1);
          }

          trRef.current?.getLayer()?.batchDraw();
        }}
      >
        <Ellipse
          name={`shape-${shapeName}`}
          id={`shape-${shapeName}-${id}`}
          x={width! / 2}
          y={height! / 2}
          width={width! - adjustedStrokeWidth!}
          height={height! - adjustedStrokeWidth!}
          radiusX={width! / 2 - adjustedStrokeWidth! / 2}
          radiusY={height! / 2 - adjustedStrokeWidth! / 2}
          stroke={stroke}
          strokeWidth={adjustedStrokeWidth}
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
