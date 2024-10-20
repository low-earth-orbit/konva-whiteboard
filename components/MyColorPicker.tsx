import React, { useState } from "react";
import { ColorResult, Sketch } from "@uiw/react-color";
import { Button, Popover } from "@mui/material";

const presetColors: string[] = [
  // Row 1 (Black and Gray)
  "#000000",
  "#4D4D4D",
  "#808080",
  "#B3B3B3",
  "#CCCCCC",
  "#E6E6E6",
  "#F2F2F2",
  "#FFFFFF",
  // Row 2 (Highly Saturated Colors)
  "#FF0000",
  "#FF7F00",
  "#FFFF00",
  "#00FF00",
  "#00FFFF",
  "#0000FF",
  "#8B00FF",
  "#FF00FF",
  // Row 3 (Low Saturated / Softer Colors)
  "#FFCCCC",
  "#FFCC99",
  "#FFFFCC",
  "#CCFFCC",
  "#CCFFFF",
  "#CCCCFF",
  "#E5CCFF",
  "#FFCCE5",
];

type Props = {
  color: string;
  onChange: (hex: string) => void;
};

function MyColorPicker({ color, onChange }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* Button to open the Popover with color picker */}
      <div style={{ marginTop: "10px" }}>
        <Button aria-describedby={"myColorPickerPopover"} onClick={handleClick}>
          {/* Square color indicator */}
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: `${color}`,
              marginRight: "10px",
              border: "1px solid #ccc",
            }}
          />
          {color}
        </Button>
      </div>

      {/* Popover for color picker */}
      <Popover
        id={"myColorPickerPopover"}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          marginTop: "5px",
        }}
      >
        <Sketch
          color={color}
          disableAlpha={true}
          presetColors={presetColors}
          onChange={(colorResult: ColorResult) => onChange(colorResult.hex)}
        />
      </Popover>
    </>
  );
}

export default MyColorPicker;
