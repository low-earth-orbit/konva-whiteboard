import React, { useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import Konva from "konva";
import { TEXT_MIN_HEIGHT, TEXT_MIN_WIDTH } from "./textUtils";

type Props = {
  objectProps: Partial<CanvasObjectType>;
  isSelected: boolean;
  onSelect: (e: any) => void;
  onChange: (newAttrs: Partial<CanvasObjectType>) => void;
  zoomLevel: number;
};

export default function TextField({
  objectProps,
  isSelected,
  onSelect,
  onChange,
  zoomLevel,
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

  const {
    type,
    id,
    text,
    x,
    y,
    width,
    height,
    rotation,
    fill,
    lineHeight,
    fontSize,
    align,
    fontStyle,
    textDecoration,
  } = objectProps;

  const selectedProps = {
    type,
    id,
    text,
    x,
    y,
    width,
    height,
    rotation,
    fill,
    lineHeight,
    fontSize,
    align,
    fontStyle,
    textDecoration,
  };

  const handleTransform = () => {
    const node = textRef.current;
    if (node) {
      node.width(node.width() * node.scaleX());
      node.height(node.height() * node.scaleY());
      node.scaleX(1);
      node.scaleY(1);
    }
  };

  const handleDoubleClick = () => {
    const node = textRef.current;
    if (node) {
      node.hide();

      // get the position for creating textarea
      const textPosition = node.absolutePosition();
      const areaPosition = {
        x: textPosition.x,
        y: textPosition.y,
      };

      // create textarea and add it to the document
      const textarea = document.createElement("textarea");
      textarea.wrap = "soft";

      document.body.appendChild(textarea);

      // adjust the styles to match
      if (node.fontStyle().includes("bold")) {
        textarea.style.fontWeight = "bold";
      }
      if (node.fontStyle().includes("italic")) {
        textarea.style.fontStyle = "italic";
      }
      if (node.textDecoration().includes("underline")) {
        const offset = node.fontSize() * 0.19;
        const thickness = node.fontSize() * 0.07;

        textarea.style.textDecoration = "underline";
        textarea.style.textUnderlineOffset = `${offset}px`;
        textarea.style.textDecorationThickness = `${thickness}px`;
      }

      textarea.id = `text-${node.id()}-textarea`;
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
      textarea.style.scale = zoomLevel.toString();
      textarea.style.textWrap = "wrap";

      // set rotation
      const rotation = node.rotation();
      let transform = "";

      if (rotation) {
        transform = `rotateZ(${rotation}deg)`;
      }

      // slightly move textarea up
      // because it jumps a bit
      const moveUpPx = node.fontSize() / 14.5;
      transform += `translateY(-${moveUpPx}px)`;

      textarea.style.transform = transform;

      textarea.focus();

      const removeTextarea = () => {
        document.body.removeChild(textarea);
        window.removeEventListener("click", handleOutsideClick);
        node.show();
        trRef.current?.show();
        trRef.current?.forceUpdate();
      };

      textarea.addEventListener("keydown", function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.key === "Enter" && !e.shiftKey) {
          node.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.key === "Escape") {
          removeTextarea();
        }
      });

      const handleOutsideClick = (e: any) => {
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
        name={type}
        onClick={(e) => onSelect(e)}
        onTap={(e) => onSelect(e)}
        ref={textRef}
        {...selectedProps}
        draggable={isSelected}
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
              width: Math.max(TEXT_MIN_WIDTH, objectProps.width! * scaleX),
              height: Math.max(TEXT_MIN_HEIGHT, objectProps.height! * scaleY),
            });
          }
        }}
      />

      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          shouldOverdrawWholeArea
          onDblClick={handleDoubleClick}
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
            if (
              Math.abs(newBox.width) < TEXT_MIN_WIDTH ||
              Math.abs(newBox.height) < TEXT_MIN_HEIGHT
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
