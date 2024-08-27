import React, { useEffect, useRef } from "react";
import { Line, Transformer } from "react-konva";
import { ShapeType } from "../Canvas";
import Konva from "konva";

type LineShapeProps = {
  shapeProps: Partial<ShapeType>;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<ShapeType>) => void;
};

export default function LineShape({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: LineShapeProps) {
  const shapeRef = useRef<Konva.Line>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const { shapeName, id, points, stroke, strokeWidth } = shapeProps;

  const selectedProps = {
    shapeName,
    id,
    points,
    stroke,
    strokeWidth,
  };

  return (
    <>
      <Line
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...selectedProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...selectedProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // Reset scale to 1
            node.scaleX(1);
            node.scaleY(1);

            const newPoints = node
              .points()
              .map((point, index) =>
                index % 2 === 0 ? point * scaleX : point * scaleY
              );

            onChange({
              ...selectedProps,
              x: node.x(),
              y: node.y(),
              points: newPoints,
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={["top-left", "top-right"]}
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
