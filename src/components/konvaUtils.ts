import { KonvaEventObject } from "konva/lib/Node";

const setCursor = (cursor: string) => (e: KonvaEventObject<MouseEvent>) => {
  const stage = e.target.getStage();
  if (stage) stage.container().style.cursor = cursor;
};

export const transformerCursorHandlers = {
  onMouseOver: setCursor("grab"),
  onMouseLeave: setCursor(""),
  onMouseDown: setCursor("grabbing"),
  onMouseUp: setCursor("grab"),
};
