import { useState } from "react";
import {
  Box,
  ButtonGroup,
  IconButton,
  Popover,
  Slider,
  SliderValueLabelProps,
  Tooltip,
} from "@mui/material";

import { HexColorPicker } from "react-colorful";
import EraserIcon from "./icons/EraserIcon";
import DrawIcon from "./icons/DrawIcon";
import DeleteIcon from "./icons/DeleteIcon";
import ShapesIcon from "./icons/ShapesIcon";
import {
  Palette,
  LineWeightRounded,
  CropSquareRounded,
  CircleOutlined,
  TextFields,
  UndoRounded,
  RedoRounded,
} from "@mui/icons-material";

import { CanvasObjectType, ToolType } from "./Canvas";

import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { redo, undo } from "@/redux/canvasSlice";

function LineWeightSliderValueLabel(props: SliderValueLabelProps) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

type ToolbarProps = {
  objects: CanvasObjectType[];
  setTool: (tool: ToolType) => void;
  onDelete: () => void;
  color: string;
  onSelectColor: (newColor: string) => void;
  strokeWidth: number;
  setStrokeWidth: (newWidth: number) => void;
};

function Toolbar({
  objects,
  setTool,
  onDelete,
  color,
  onSelectColor,
  strokeWidth,
  setStrokeWidth,
}: ToolbarProps) {
  const dispatch = useDispatch();

  const { undoStack, redoStack } = useSelector(
    (state: RootState) => state.canvas,
  );

  // color picker
  const [colorPickerAnchorEl, setColorPickerAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const isColorPickerAnchorElOpen = Boolean(colorPickerAnchorEl);

  const handleClickColorPickerButton = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setColorPickerAnchorEl(event.currentTarget);
  };

  const handleCloseColorPicker = () => {
    setColorPickerAnchorEl(null);
  };

  // shapes
  const [shapesAnchorEl, setShapesAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const isShapesAnchorElOpen = Boolean(shapesAnchorEl);

  const handleClickShapesButton = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setShapesAnchorEl(event.currentTarget);
  };

  const handleCloseShapesPopover = () => {
    setShapesAnchorEl(null);
  };

  // stroke width
  const [lineWeightAnchorEl, setLineWeightAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const isLineWeightSliderAnchorElOpen = Boolean(lineWeightAnchorEl);

  const handleClickLineWeightButton = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setLineWeightAnchorEl(event.currentTarget);
  };

  const handleCloseLineWeightSlider = () => {
    setLineWeightAnchorEl(null);
  };

  const handleChangeStrokeWidth = (value: number) => {
    setStrokeWidth(value);
  };

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white">
      <ButtonGroup
        variant="contained"
        aria-label="toolbar buttons"
        className="flex gap-2 p-1"
      >
        {/* pen */}
        <Tooltip title="Draw">
          <IconButton aria-label="Draw" onClick={() => setTool("pen")}>
            <DrawIcon />
          </IconButton>
        </Tooltip>

        {/* text */}
        <Tooltip title="Add text">
          <IconButton
            aria-label="Add text"
            onClick={() => {
              setTool("addText");
            }}
          >
            <TextFields />
          </IconButton>
        </Tooltip>

        {/* shapes */}
        <Tooltip title="Add shape">
          <IconButton aria-label="Add shape" onClick={handleClickShapesButton}>
            <ShapesIcon />
          </IconButton>
        </Tooltip>

        {/* line weight */}
        <Tooltip title="Stroke width">
          <IconButton
            aria-label="Change stroke width"
            onClick={handleClickLineWeightButton}
          >
            <LineWeightRounded />
          </IconButton>
        </Tooltip>

        {/* color picker */}
        <Tooltip title="Color">
          <IconButton
            aria-label="open color palette"
            onClick={handleClickColorPickerButton}
          >
            <Palette />
          </IconButton>
        </Tooltip>

        {/* eraser */}
        <Tooltip title="Eraser">
          <IconButton aria-label="erase" onClick={() => setTool("eraser")}>
            <EraserIcon />
          </IconButton>
        </Tooltip>

        {/* undo */}
        <Tooltip title="Undo">
          <span>
            <IconButton
              aria-label="undo"
              disabled={undoStack.length === 0}
              onClick={() => dispatch(undo())}
            >
              <UndoRounded />
            </IconButton>
          </span>
        </Tooltip>

        {/* redo */}
        <Tooltip title="Redo">
          <span>
            <IconButton
              aria-label="redo"
              disabled={redoStack.length === 0}
              onClick={() => dispatch(redo())}
            >
              <RedoRounded />
            </IconButton>
          </span>
        </Tooltip>

        {/* delete */}
        <Tooltip title="Delete">
          <span>
            <IconButton
              aria-label="delete"
              onClick={onDelete}
              color="warning"
              disabled={objects.length === 0}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </ButtonGroup>

      {/* colorPickerPopover */}
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
        <HexColorPicker
          className="p-2"
          color={color}
          onChange={onSelectColor}
        />
      </Popover>

      {/* lineWeightPopover */}
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

      {/* shapesPopover */}
      <Popover
        id="shapesPopover"
        open={isShapesAnchorElOpen}
        anchorEl={shapesAnchorEl}
        onClose={handleCloseShapesPopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {/* shapes */}
        <Tooltip title="Add rectangle">
          <IconButton
            aria-label="Add rectangle"
            onClick={() => {
              handleCloseShapesPopover();
              setTool("addRectangle");
            }}
          >
            <CropSquareRounded />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add oval">
          <IconButton
            aria-label="Add oval"
            onClick={() => {
              handleCloseShapesPopover();
              setTool("addOval");
            }}
          >
            <CircleOutlined />
          </IconButton>
        </Tooltip>
      </Popover>
    </div>
  );
}

export default Toolbar;
