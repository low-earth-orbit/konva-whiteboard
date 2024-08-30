import React, { useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import Konva from "konva";

type Props = {
  objectProps: Partial<CanvasObjectType>;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasObjectType>) => void;
};

export default function TextField({
  objectProps,
  isSelected,
  onSelect,
  onChange,
}: Props) {
  const textRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const { id, x, y, width, stroke, text, fontSize } = objectProps;

  const selectedProps = {
    id,
    x,
    y,
    width,
    stroke,
    text,
    fontSize,
  };

  const handleTransform = () => {
    const node = textRef.current;
    if (node) {
      node.width(node.width() * node.scaleX());
      node.scaleX(1);
    }
  };

  const handleDoubleClick = () => {
    const node = textRef.current;
    if (node) {
      const textPosition = node.absolutePosition();
      const areaPosition = {
        x: textPosition.x,
        y: textPosition.y,
      };

      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea);
      textarea.value = node.text();
      textarea.style.position = "absolute";
      textarea.style.top = `${areaPosition.y}px`;
      textarea.style.left = `${areaPosition.x}px`;
      textarea.style.width = `${node.width()}px`;
      textarea.style.height = `${node.height()}px`;
      textarea.style.fontSize = `${node.fontSize()}px`;
      textarea.style.border = "none";
      textarea.style.padding = "0";
      textarea.style.margin = "0";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      textarea.style.lineHeight = `${node.lineHeight()}`;
      textarea.style.fontFamily = node.fontFamily();
      textarea.style.textAlign = node.align();
      textarea.style.color = node.fill() as string;
      textarea.style.transformOrigin = "left top";

      textarea.focus();

      const removeTextarea = () => {
        document.body.removeChild(textarea);
        setSelectedId(null);
        node.show();
        trRef.current?.show();
      };

      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          node.text(textarea.value);
          removeTextarea();
        } else if (e.key === "Escape") {
          removeTextarea();
        }
      });

      textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      });

      const handleOutsideClick = (e: MouseEvent) => {
        if (e.target !== textarea) {
          node.text(textarea.value);
          removeTextarea();
        }
      };
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
    }
  };

  return (
    <>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={textRef}
        {...selectedProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...selectedProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={handleTransform}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = textRef.current;
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
        onDblClick={handleDoubleClick}
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
