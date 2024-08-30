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

  const {
    id,
    x,
    y,
    width,
    height,
    stroke,
    text,
    fontSize,
    fontFamily,
    rotation,
  } = objectProps;

  const selectedProps = {
    id,
    x,
    y,
    width,
    height,
    stroke,
    text,
    fontSize,
    fontFamily,
    fontStyle: "normal",
    rotation,
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
      // hide node and transformer
      node.hide();
      trRef.current?.hide();

      // get the position for creating textarea
      const textPosition = node.absolutePosition();
      const areaPosition = {
        x: textPosition.x,
        y: textPosition.y,
      };

      // create textarea and add it to the document
      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea);

      // adjust the styles to match
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
      textarea.style.fontStyle = node.fontStyle();
      textarea.style.textAlign = node.align();
      textarea.style.color = node.stroke() as string;
      textarea.style.transformOrigin = "left top";

      // set rotation
      const rotation = node.rotation();
      let transform = "";

      if (rotation) {
        transform = `rotateZ(${rotation}deg)`;
      }

      let px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        px += 2 + Math.round(node.fontSize() / 20);
      }
      transform += `translateY(-${px}px)`;

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = "auto";
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + "px";

      textarea.focus();

      const removeTextarea = () => {
        document.body.removeChild(textarea);
        window.removeEventListener("click", handleOutsideClick);
        node.show();
        trRef.current?.show();
        trRef.current?.forceUpdate();
      };

      const setTextareaWidth = (newWidth: number) => {
        if (!newWidth) {
          const placeholderText = (node as any)?.placeholder || ""; // check placeholder text
          newWidth = placeholderText.length * node.fontSize();
        }

        // Browser checks
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        const isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        // Edge browser
        const isEdge = /Edg/.test(navigator.userAgent);

        if (isEdge) {
          newWidth = (Number(newWidth) || 0) + 1;
        }

        textarea.style.width = `${newWidth}px`;
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
        } else {
          const scale = node.getAbsoluteScale().x;
          setTextareaWidth(node.width() * scale);
          textarea.style.height = "auto";
          textarea.style.height =
            textarea.scrollHeight + node.fontSize() + "px";
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