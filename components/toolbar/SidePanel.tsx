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

export default function SidePanel({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {
  const [borderWidth, setBorderWidth] = React.useState(1);
  const [borderColor, setBorderColor] = React.useState("#000000");
  const [fillColor, setFillColor] = React.useState("#ffffff");
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [isBorderPicker, setIsBorderPicker] = React.useState(true);

  const handleColorPickerOpen = (isBorder: boolean) => {
    setIsBorderPicker(isBorder);
    setColorPickerOpen(true);
  };

  const handleColorChange = (color: string) => {
    if (isBorderPicker) {
      setBorderColor(color);
    } else {
      setFillColor(color);
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
        <Typography variant="h6">Edit shape</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Border Width Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Border width</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography sx={{ mr: 2, width: 30, textAlign: "center" }}>
            {borderWidth}
          </Typography>
          <Slider
            value={borderWidth}
            min={1}
            max={100}
            valueLabelDisplay="auto"
            slots={{
              valueLabel: LineWeightSliderValueLabel,
            }}
            aria-label="Border width"
            onChange={(_, value) => setBorderWidth(value as number)}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      {/* Border Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Color</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              bgcolor: borderColor,
              border: "1px solid black",
              borderRadius: "50%",
              mr: 2,
            }}
          />
          <Button
            variant="outlined"
            onClick={() => handleColorPickerOpen(true)}
          >
            Change border color
          </Button>
        </Box>
      </Box>

      {/* Fill Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Fill</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              bgcolor: fillColor,
              border: "1px solid black",
              borderRadius: "50%",
              mr: 2,
            }}
          />
          <Button
            variant="outlined"
            onClick={() => handleColorPickerOpen(false)}
          >
            Change fill color
          </Button>
        </Box>
      </Box>

      {/* Color Picker Dialog */}
      <Dialog open={colorPickerOpen} onClose={() => setColorPickerOpen(false)}>
        <DialogTitle>{isBorderPicker ? "Border" : "Fill"}</DialogTitle>
        <DialogContent>
          <HexColorPicker
            color={isBorderPicker ? borderColor : fillColor}
            onChange={handleColorChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} variant="persistent">
      {drawer}
    </Drawer>
  );
}
