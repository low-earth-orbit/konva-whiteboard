import React, { useEffect, useRef } from "react";
import { Group, Rect, Transformer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import Konva from "konva";

type Props = {
  shapeProps: Partial<CanvasObjectType>;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasObjectType>) => void;
};

const getStrokeWidth = (
  strokeWidth: number | undefined,
  width: number | undefined,
  height: number | undefined
) => {
  if (width && height) {
    const minStrokeWidth = Math.max(Math.min(width, height) / 2, 1);
    if (strokeWidth && strokeWidth * 2 > Math.min(width, height)) {
      return minStrokeWidth;
    }
    return strokeWidth;
  }
};

export default function RectangleShape({ shapeProps, isSelected, onSelect, onChange }: Props) {
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      // attach the transformer to the group
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const { id, x, y, width, height, stroke, strokeWidth, rotation } = shapeProps;

  const adjustedStrokeWidth = getStrokeWidth(strokeWidth, width, height);

  return (
    <>
      <Group
        ref={groupRef}
        name="shapeGroup"
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        draggable
        rotation={rotation}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const group = groupRef.current;

          console.log("node inside onTransformEnd = ", group);

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
        <Rect
          name="shape"
          id={`shape-${id}`}
          x={0}
          y={0}
          width={width}
          height={height}
          stroke={stroke}
          strokeWidth={adjustedStrokeWidth}
          lineJoin="round" // round corners
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
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
