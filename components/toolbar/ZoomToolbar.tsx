import React, { useEffect, useState } from "react";
import Konva from "konva";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Paper,
} from "@mui/material";
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
      const newZoom = Math.min(zoomLevel + 0.1, 3); // Max zoom level = 300%
      setZoomLevel(newZoom);
      stage.scale({ x: newZoom, y: newZoom });
      stage.batchDraw();
    }
  };

  // Zoom out
  const handleZoomOut = () => {
    const stage = stageRef.current;
    if (stage) {
      const newZoom = Math.max(zoomLevel - 0.1, 0.1); // Min zoom level = 10%
      setZoomLevel(newZoom);
      stage.scale({ x: newZoom, y: newZoom });
      stage.batchDraw();
    }
  };

  // Fit to canvas
  const handleFit = () => {
    const stage = stageRef.current;
    if (stage) {
      const containerWidth = stage.width();
      const containerHeight = stage.height();
      const scaleX = containerWidth / stage.getContent().offsetWidth;
      const scaleY = containerHeight / stage.getContent().offsetHeight;
      const fitZoom = Math.min(scaleX, scaleY); // Fit the content within the stage
      setZoomLevel(fitZoom);
      stage.scale({ x: fitZoom, y: fitZoom });
      stage.batchDraw();
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

  const applyZoom = () => {
    const stage = stageRef.current;
    const value = Number(inputValue);

    if (!isNaN(value) && value >= 10 && value <= 300) {
      const constrainedZoom = Math.min(Math.max(value / 100, 0.1), 3);
      setZoomLevel(constrainedZoom);
      if (stage) {
        stage.scale({ x: constrainedZoom, y: constrainedZoom });
        stage.batchDraw();
      }
    } else {
      // If the input is invalid, reset to current zoom level
      setInputValue((zoomLevel * 100).toFixed(0));
    }
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
