import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ShapePanel from "./ShapePanel";
import TextPanel from "./TextPanel";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  setBorderWidth: (newWidth: number) => void;
  onSelectBorderColor: (newColor: string) => void;
  onSelectFillColor: (newColor: string) => void;
};

export default function SidePanel({
  isOpen,
  onClose,
  setBorderWidth,
  onSelectBorderColor,
  onSelectFillColor,
}: Props) {
  const { canvasObjects, selectedObjectId } = useSelector(
    (state: RootState) => state.canvas,
  );

  // Find the selected object
  const selectedObject = canvasObjects.find(
    (obj) => obj.id === selectedObjectId,
  );

  const isShapeSelected = selectedObject?.type === "shape";
  const isTextSelected = selectedObject?.type === "text";

  if (isShapeSelected) {
    return (
      <ShapePanel
        isOpen={isOpen}
        onClose={onClose}
        setBorderWidth={setBorderWidth}
        onSelectBorderColor={onSelectBorderColor}
        onSelectFillColor={onSelectFillColor}
      />
    );
  }

  if (isTextSelected) {
    return (
      <TextPanel
        isOpen={isOpen}
        onClose={onClose}
        selectedObjectId={selectedObjectId}
      />
    );
  }

  return null;
}
