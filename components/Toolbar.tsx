import EraserIcon from "./icons/EraserIcon";
import DrawIcon from "./icons/DrawIcon";
import DeleteIcon from "./icons/DeleteIcon";
import {
  Box,
  ButtonGroup,
  IconButton,
  Popover,
  Slider,
  SliderValueLabelProps,
  Tooltip,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import LineWeightRoundedIcon from "@mui/icons-material/LineWeightRounded";
import CropSquareRoundedIcon from "@mui/icons-material/CropSquareRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

function LineWeightSliderValueLabel(props: SliderValueLabelProps) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

type ToolbarProps = {
  selectTool: (tool: string) => void;
  resetCanvas: () => void;
  color: string;
  selectColor: (newColor: string) => void;
  strokeWidth: number;
  setStrokeWidth: (newWidth: number) => void;
  handleAddShape: (shapeName: string) => void;
};

function Toolbar({
  selectTool,
  resetCanvas,
  color,
  selectColor,
  strokeWidth,
  setStrokeWidth,
  handleAddShape,
}: ToolbarProps) {
  // color picker
  const [colorPickerAnchorEl, setColorPickerAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleClickColorPickerButton = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setColorPickerAnchorEl(event.currentTarget);
  };

  const handleCloseColorPicker = () => {
    setColorPickerAnchorEl(null);
  };

  const isColorPickerAnchorElOpen = Boolean(colorPickerAnchorEl);

  // line weight
  const [lineWeightAnchorEl, setLineWeightAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleClickLineWeightButton = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setLineWeightAnchorEl(event.currentTarget);
  };

  const handleCloseLineWeightSlider = () => {
    setLineWeightAnchorEl(null);
  };

  const handleChangeStrokeWidth = (value: number) => {
    setStrokeWidth(value);
  };

  const isLineWeightSliderAnchorElOpen = Boolean(lineWeightAnchorEl);

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white">
      <ButtonGroup
        variant="contained"
        aria-label="toolbar buttons"
        className="flex gap-2 p-1"
      >
        {/* pen */}
        <IconButton aria-label="draw" onClick={() => selectTool("pen")}>
          <DrawIcon />
        </IconButton>

        {/* shapes */}
        <IconButton
          aria-label="add rectangle"
          onClick={() => handleAddShape("rectangle")}
        >
          <CropSquareRoundedIcon />
        </IconButton>
        <IconButton
          aria-label="add ellipse"
          onClick={() => handleAddShape("ellipse")}
        >
          <CircleOutlinedIcon />
        </IconButton>

        {/* line weight */}
        <IconButton
          aria-label="change line weight"
          onClick={handleClickLineWeightButton}
        >
          <LineWeightRoundedIcon />
        </IconButton>

        {/* color picker */}
        <IconButton
          aria-label="open color palette"
          onClick={handleClickColorPickerButton}
        >
          <PaletteIcon />
        </IconButton>

        {/* eraser */}
        <IconButton aria-label="erase" onClick={() => selectTool("eraser")}>
          <EraserIcon />
        </IconButton>

        {/* delete */}
        <IconButton aria-label="delete everything" onClick={resetCanvas}>
          <DeleteIcon />
        </IconButton>
      </ButtonGroup>

      <Popover
        id="colorPickerPopover"
        open={isColorPickerAnchorElOpen}
        anchorEl={colorPickerAnchorEl}
        onClose={handleCloseColorPicker}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <HexColorPicker className="p-2" color={color} onChange={selectColor} />
      </Popover>

      <Popover
        id="lineWeightPopover"
        open={isLineWeightSliderAnchorElOpen}
        anchorEl={lineWeightAnchorEl}
        onClose={handleCloseLineWeightSlider}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box sx={{ width: 200 }} className="p-2">
          <Slider
            valueLabelDisplay="auto"
            max={100}
            min={1}
            slots={{
              valueLabel: LineWeightSliderValueLabel,
            }}
            aria-label="custom thumb label"
            value={strokeWidth}
            onChange={(_, value) => handleChangeStrokeWidth(value as number)}
          />
        </Box>
      </Popover>
    </div>
  );
}

export default Toolbar;
