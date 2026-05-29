import { useState } from "react";
import Konva from "konva";
import { ActionIcon, Group, NumberInput, Paper } from "@mantine/core";
import { IconFocusCentered, IconMinus, IconPlus } from "@tabler/icons-react";

type ToolbarProps = {
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  stageRef: React.RefObject<Konva.Stage | null>;
};

export default function ZoomToolbar({
  zoomLevel,
  setZoomLevel,
  stageRef,
}: ToolbarProps) {
  const [editValue, setEditValue] = useState<string | null>(null);
  const inputValue = editValue ?? (zoomLevel * 100).toFixed(0);

  // Zoom in
  const handleZoomIn = () => {
    const stage = stageRef.current;
    if (stage) {
      const newScale = Math.min(zoomLevel + 0.1, 3); // Max zoom level = 300%

      const oldScale = stage.scaleX();
      const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const centerTo = {
        x: (center.x - stage.x()) / oldScale,
        y: (center.y - stage.y()) / oldScale,
      };

      const newPos = {
        x: center.x - centerTo.x * newScale,
        y: center.y - centerTo.y * newScale,
      };

      moveStage(stage, newPos, newScale);
    }
  };

  // Zoom out
  const handleZoomOut = () => {
    const stage = stageRef.current;
    if (stage) {
      const newScale = Math.max(zoomLevel - 0.1, 0.1); // Min zoom level = 10%

      const oldScale = stage.scaleX();
      const center = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      const centerTo = {
        x: (center.x - stage.x()) / oldScale,
        y: (center.y - stage.y()) / oldScale,
      };

      const newPos = {
        x: center.x - centerTo.x * newScale,
        y: center.y - centerTo.y * newScale,
      };

      moveStage(stage, newPos, newScale);
    }
  };

  const handleInputChange = (value: string | number) => {
    setEditValue(String(value));
  };

  const handleInputBlur = () => {
    applyZoom();
    setEditValue(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyZoom();
      setEditValue(null);
    }
  };

  const applyZoom = (): void => {
    const value = Number(inputValue);

    if (!isNaN(value) && value >= 10 && value <= 300) {
      const stage = stageRef.current;
      if (stage) {
        const newScale = value / 100;

        const oldScale = stage.scaleX();
        const center = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };
        const centerTo = {
          x: (center.x - stage.x()) / oldScale,
          y: (center.y - stage.y()) / oldScale,
        };

        const newPos = {
          x: center.x - centerTo.x * newScale,
          y: center.y - centerTo.y * newScale,
        };

        moveStage(stage, newPos, newScale);
      }
    }
  };

  // Fit to canvas
  const handleFit = () => {
    const stage = stageRef.current;
    if (stage) {
      const layers = stage.getLayers();
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      // Find the bounding box of all layers
      layers.forEach((layer) => {
        const layerRect = layer.getClientRect({ relativeTo: stage });
        const { x, y, width, height } = layerRect;
        if (width > 0 && height > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x + width);
          maxY = Math.max(maxY, y + height);
        }
      });

      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;

      if (contentWidth > 0 && contentHeight > 0) {
        // Calculate new scale
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scaleX = windowWidth / contentWidth;
        const scaleY = windowHeight / contentHeight;
        const scaleValue = Math.min(scaleX, scaleY) * 0.9; // Leave some padding

        const newScale = Math.max(0.1, Math.min(scaleValue, 3)); // Limit the zoom range

        // Calculate the center of the content and the window
        const contentCenter = {
          x: (minX + maxX) / 2,
          y: (minY + maxY) / 2,
        };

        const windowCenter = {
          x: windowWidth / 2,
          y: windowHeight / 2,
        };

        // Calculate new position to center the content in the window
        const newPos = {
          x: windowCenter.x - contentCenter.x * newScale,
          y: windowCenter.y - contentCenter.y * newScale,
        };
        // Move the stage with animation
        moveStage(stage, newPos, newScale, 0.1);
      } else {
        // Reset to original scale if no valid content
        moveStage(stage, { x: 0, y: 0 }, 1);
      }
    }
  };

  // Animation
  const moveStage = (
    stage: Konva.Stage,
    offset: { x: number; y: number },
    scale: number,
    animationDuration: number = 0,
  ) => {
    // update state
    setZoomLevel(scale);

    const tween = new Konva.Tween({
      duration: animationDuration,
      easing: Konva.Easings.EaseInOut,
      node: stage,
      scaleX: scale || 1,
      scaleY: scale || 1,
      x: offset.x,
      y: offset.y,
      onFinish: () => {
        tween.destroy();
        stage.batchDraw();
      },
    });

    tween.play();
  };

  return (
    <Paper shadow="sm" style={{ position: "fixed", bottom: 8, right: 8 }} p={4}>
      <Group gap={4} wrap="nowrap" align="center">
        <ActionIcon
          variant="subtle"
          aria-label="Zoom out"
          onClick={handleZoomOut}
        >
          <IconMinus size={18} />
        </ActionIcon>
        <NumberInput
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          hideControls
          styles={{ input: { width: 60, textAlign: "center" } }}
          aria-label="Zoom level"
        />
        <ActionIcon
          variant="subtle"
          aria-label="Zoom in"
          onClick={handleZoomIn}
        >
          <IconPlus size={18} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          aria-label="Fit to canvas"
          onClick={handleFit}
        >
          <IconFocusCentered size={18} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
