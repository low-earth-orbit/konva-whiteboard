import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";
import { ShapeType } from "../Canvas";
import Konva from "konva";

type RectangleShapeProps = {
  shapeProps: Partial<ShapeType>;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<ShapeType>) => void;
};

export default function RectangleShape({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: RectangleShapeProps) {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const { shapeName, id, x, y, width, height, stroke, strokeWidth } =
    shapeProps;

  const selectedProps = {
    shapeName,
    id,
    x,
    y,
    width,
    height,
    stroke,
    strokeWidth,
  };

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...selectedProps}
        draggable
        lineJoin="round" // round corners
        onDragEnd={(e) => {
          onChange({
            ...selectedProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...selectedProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(
                5,
                (selectedProps.width ?? node.width()) * scaleX
              ),
              height: Math.max(
                5,
                (selectedProps.height ?? node.height()) * scaleY
              ),
            });
          }
        }}
      />
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
