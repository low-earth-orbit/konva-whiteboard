import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ShapePanel from "./ShapePanel";
import TextPanel from "./TextPanel";
import { setIsSidePanelOpen } from "@/redux/settingsSlice";

export default function SidePanel() {
  const dispatch = useDispatch();
  const { isSidePanelOpen, selectedTool } = useSelector(
    (state: RootState) => state.settings,
  );

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
        isOpen={isSidePanelOpen}
        onClose={() => dispatch(setIsSidePanelOpen(false))}
        selectedObjectId={selectedObjectId}
      />
    );
  }

  if (isTextSelected) {
    return (
      <TextPanel
        isOpen={isSidePanelOpen}
        onClose={() => dispatch(setIsSidePanelOpen(false))}
        selectedObjectId={selectedObjectId}
      />
    );
  }

  if (selectedTool === "pen") return <p>You selected pen tool.</p>;

  return null;
}
