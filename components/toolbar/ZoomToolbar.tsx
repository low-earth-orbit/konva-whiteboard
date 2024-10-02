import React, { useEffect, useState } from "react";
import Konva from "konva";
import { TextField, IconButton, Paper } from "@mui/material";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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
  const [inputValue, setInputValue] = useState<string>(
    (zoomLevel * 100).toFixed(0),
  );

  useEffect(() => {
    setInputValue((zoomLevel * 100).toFixed(0));
  }, [zoomLevel]);

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

  // Allow any value while typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    applyZoom();
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyZoom();
    }
  };

  const applyZoom = (): void => {
    const value = Number(inputValue);

    if (!isNaN(value) && value >= 10 && value <= 300) {
      const stage = stageRef.current;
      if (stage) {
        const newScale = Math.min(Math.max(value / 100, 0.1), 3);

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
    } else {
      // If the input is invalid, reset to current zoom level
      setInputValue((zoomLevel * 100).toFixed(0));
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
        moveStage(stage, newPos, newScale);
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
  ) => {
    // update state
    setZoomLevel(scale);

    const tween = new Konva.Tween({
      duration: 0.35,
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
    <Paper
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        height: 48,
        borderRadius: 1,
        boxShadow: 3,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Zoom In */}
      <IconButton onClick={handleZoomOut}>
        <RemoveIcon />
      </IconButton>
      {/* Zoom Percentage Input */}
      <div>
        <TextField
          value={inputValue}
          size="small"
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          inputProps={{
            type: "number",
          }}
          sx={{
            width: 60,
            input: { textAlign: "center" },
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
              {
                display: "none",
              },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
        />
      </div>

      <IconButton onClick={handleZoomIn}>
        <AddIcon />
      </IconButton>

      <IconButton onClick={handleFit}>
        <FitScreenIcon />
      </IconButton>
    </Paper>
  );
}
