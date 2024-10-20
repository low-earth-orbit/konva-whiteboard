import * as React from "react";
import {
  Box,
  Drawer,
  Typography,
  Divider,
  IconButton,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LineWeightSliderValueLabel } from "../Toolbar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ShapePanel from "./ShapePanel";
import TextPanel from "./TextPanel";

type Props = {
  panelStatus: { isShapePanelVisible: boolean; isTextPanelVisible: boolean };
  onClose: () => void;
  strokeWidth: number;
  setStrokeWidth: (newWidth: number) => void;
  color: string;
  onSelectColor: (newColor: string) => void;
  fillColor: string;
  onSelectFillColor: (newColor: string) => void;
};

export default function SidePanel({
  panelStatus,
  onClose,
  strokeWidth,
  setStrokeWidth,
  color,
  onSelectColor,
  fillColor,
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
        isOpen={panelStatus.isShapePanelVisible}
        onClose={onClose}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        color={color}
        onSelectColor={onSelectColor}
        fillColor={fillColor}
        onSelectFillColor={onSelectFillColor}
      />
    );
  }

  if (isTextSelected) {
    return (
      <TextPanel
        isOpen={panelStatus.isTextPanelVisible}
        onClose={onClose}
        selectedObjectId={selectedObjectId}
      />
    );
  }

  return null;
}
