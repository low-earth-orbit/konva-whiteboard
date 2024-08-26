import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import { ShapeType } from "../Canvas";
import { Node } from "konva/lib/Node";
import Konva from "konva";

type RectangleProps = {
  shapeProps: ShapeType;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: ShapeType) => void;
};

export default function Rectangle({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: RectangleProps) {
  const shapeRef = React.useRef<Konva.Rect>(null);
  const trRef = React.useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current as unknown as Node]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node: Node = shapeRef.current as unknown as Node;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
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
