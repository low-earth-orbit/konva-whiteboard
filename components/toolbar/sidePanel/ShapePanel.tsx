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
import MyColorPicker from "@/components/MyColorPicker";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  strokeWidth: number;
  setStrokeWidth: (newWidth: number) => void;
  color: string;
  onSelectColor: (newColor: string) => void;
  fillColor: string;
  onSelectFillColor: (newColor: string) => void;
};

export default function ShapePanel({
  isOpen,
  onClose,
  strokeWidth,
  setStrokeWidth,
  color,
  onSelectColor,
  fillColor,
  onSelectFillColor,
}: Props) {
  const handleColorChange = (newColor: string, type: string) => {
    if (type === "border") {
      onSelectColor(newColor);
    } else if (type === "fill") {
      onSelectFillColor(newColor);
    }
  };

  const drawer = (
    <>
      {/* Title with Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="subtitle1">Edit shape</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Border Width Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Border width</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            sx={{ mr: 2, width: 30, textAlign: "center", fontSize: "0.875rem" }}
          >
            {strokeWidth}px
          </Typography>
          <Slider
            value={strokeWidth}
            min={1}
            max={100}
            valueLabelDisplay="auto"
            slots={{
              valueLabel: LineWeightSliderValueLabel,
            }}
            aria-label="Border width"
            onChange={(_, value) => setStrokeWidth(value as number)}
            sx={{ flex: 1, mr: 2 }}
          />
        </Box>
      </Box>

      {/* Border Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Color</Typography>
        <MyColorPicker
          color={color}
          onChange={(newColor) => handleColorChange(newColor, "border")}
        />
      </Box>

      {/* Fill Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Fill</Typography>
        <MyColorPicker
          color={fillColor}
          onChange={(newColor) => handleColorChange(newColor, "fill")}
        />
      </Box>
    </>
  );

  return (
    <Drawer
      open={isOpen}
      anchor="left"
      onClose={onClose}
      variant="persistent"
      PaperProps={{
        sx: {
          width: 300, // Fixed width for the panel
          borderRadius: "10px", // Rounded corner
          boxShadow: 2,
          margin: 1,
          height: "calc(100% - 16px)",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
