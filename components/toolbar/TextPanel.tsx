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
  TextField,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { HexColorPicker } from "react-colorful";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  textSize: number;
  setTextSize: (newSize: number) => void;
  textStyle: string[];
  setTextStyle: (newStyle: string[]) => void;
  textColor: string;
  onSelectTextColor: (newColor: string) => void;
  textAlign: string;
  setTextAlign: (newAlign: string) => void;
  lineHeight: number;
  setLineHeight: (newHeight: number) => void;
};

export default function TextPanel({
  onClose,
  isOpen,
  textSize,
  setTextSize,
  textStyle,
  setTextStyle,
  textColor,
  onSelectTextColor,
  textAlign,
  setTextAlign,
  lineHeight,
  setLineHeight,
}: Props) {
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);

  const handleColorPickerOpen = () => {
    setColorPickerOpen(true);
  };

  const handleColorChange = (color: string) => {
    onSelectTextColor(color);
  };

  const handleTextStyleChange = (
    event: React.MouseEvent<HTMLElement>,
    newStyles: string[],
  ) => {
    setTextStyle(newStyles);
  };

  const handleTextAlignChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlign: string,
  ) => {
    setTextAlign(newAlign);
  };

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="subtitle1">Edit text</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Text Size Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Size</Typography>
        <TextField
          type="number"
          value={textSize}
          onChange={(e) => setTextSize(Number(e.target.value))}
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ width: 80, mt: 1 }}
        />
      </Box>

      {/* Text Style Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Style</Typography>
        <ToggleButtonGroup
          value={textStyle}
          onChange={handleTextStyleChange}
          aria-label="text formatting"
          sx={{ mt: 1 }}
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underline" aria-label="underline">
            <FormatUnderlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Text Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Color</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              bgcolor: textColor,
              border: "1px solid #555",
              borderRadius: "50%",
              mr: 2,
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleColorPickerOpen}
          >
            Change text color
          </Button>
        </Box>
      </Box>

      {/* Text Alignment Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Alignment</Typography>
        <ToggleButtonGroup
          value={textAlign}
          exclusive
          onChange={handleTextAlignChange}
          aria-label="text alignment"
          sx={{ mt: 1 }}
        >
          <ToggleButton value="left" aria-label="left align">
            <FormatAlignLeftIcon />
          </ToggleButton>
          <ToggleButton value="center" aria-label="center align">
            <FormatAlignCenterIcon />
          </ToggleButton>
          <ToggleButton value="right" aria-label="right align">
            <FormatAlignRightIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Line Spacing Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Line spacing</Typography>
        <TextField
          type="number"
          value={lineHeight}
          onChange={(e) => setLineHeight(Number(e.target.value))}
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ width: 80, mt: 1 }}
        />
      </Box>

      {/* Color Picker Dialog */}
      <Dialog open={colorPickerOpen} onClose={() => setColorPickerOpen(false)}>
        <DialogTitle>Text Color</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <HexColorPicker color={textColor} onChange={handleColorChange} />
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
          width: 300,
          borderRadius: "10px",
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
