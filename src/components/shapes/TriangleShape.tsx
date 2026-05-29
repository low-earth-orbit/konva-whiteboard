import Konva from "konva";
import { useEffect, useRef } from "react";
import { Group, Line, Transformer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import {
  getStrokeWidth,
  SHAPE_MIN_HEIGHT,
  SHAPE_MIN_WIDTH,
} from "./shapeUtils";
import { transformerCursorHandlers } from "../konvaUtils";

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

  const {
    shapeName,
    id,
    x,
    y,
    width,
    height,
    stroke,
    strokeWidth,
    fill,
    rotation,
  } = shapeProps;

  const adjustedStrokeWidth = getStrokeWidth(strokeWidth, width, height);

  // Coordinates for a triangle
  const points = [
    width! / 2,
    adjustedStrokeWidth! / 2, // Top point
    width! - adjustedStrokeWidth! / 2,
    height! - adjustedStrokeWidth! / 2, // Bottom-right point
    adjustedStrokeWidth! / 2,
    height! - adjustedStrokeWidth! / 2, // Bottom-left point
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
        draggable={isSelected}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
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
        <Line
          name={`shape-${shapeName}`}
          id={`shape-${shapeName}-${id}`}
          points={points}
          closed={true} // closes the shape (triangle)
          stroke={stroke}
          fill={fill}
          strokeWidth={adjustedStrokeWidth}
          lineJoin="round" // round corners
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          shouldOverdrawWholeArea
          {...transformerCursorHandlers}
          boundBoxFunc={(oldBox, newBox) => {
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
