import * as React from "react";
import {
  Box,
  Drawer,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { HexColorPicker } from "react-colorful";
import { LineWeightSliderValueLabel } from "./Toolbar";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  strokeWidth: number;
  setStrokeWidth: (newWidth: number) => void;
  color: string;
  onSelectColor: (newColor: string) => void;
  fillColor: string;
  onSelectFillColor: (newColor: string) => void;
};

export default function ShapePanel({
  onClose,
  isOpen,
  strokeWidth,
  setStrokeWidth,
  color,
  onSelectColor,
  fillColor,
  onSelectFillColor,
}: Props) {
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [isBorderPicker, setIsBorderPicker] = React.useState(true);

  const handleColorPickerOpen = (isBorder: boolean) => {
    setIsBorderPicker(isBorder);
    setColorPickerOpen(true);
  };

  const handleColorChange = (color: string) => {
    if (isBorderPicker) {
      onSelectColor(color);
    } else {
      onSelectFillColor(color);
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
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      {/* Border Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Color</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              bgcolor: color,
              border: "1px solid #555",
              borderRadius: "50%",
              mr: 2,
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleColorPickerOpen(true)}
          >
            Change border color
          </Button>
        </Box>
      </Box>

      {/* Fill Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Fill</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              bgcolor: fillColor,
              border: "1px solid #555",
              borderRadius: "50%",
              mr: 2,
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleColorPickerOpen(false)}
          >
            Change fill color
          </Button>
        </Box>
      </Box>

      {/* Color Picker Dialog */}
      <Dialog open={colorPickerOpen} onClose={() => setColorPickerOpen(false)}>
        <DialogTitle>{isBorderPicker ? "Border" : "Fill"}</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <HexColorPicker
            color={isBorderPicker ? color : fillColor}
            onChange={handleColorChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <Drawer
      anchor="right"
      open={isOpen}
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
