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

import EraserIcon from "../icons/EraserIcon";
import DrawIcon from "../icons/DrawIcon";
import DeleteIcon from "../icons/DeleteIcon";
import ShapesIcon from "../icons/ShapesIcon";
import {
  Palette,
  LineWeightRounded,
  CropSquareRounded,
  CircleOutlined,
  ChangeHistoryRounded,
  StarBorderPurple500Rounded,
  TextFields,
  UndoRounded,
  RedoRounded,
} from "@mui/icons-material";

import { CanvasObjectType } from "../Canvas";

import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { redo, selectCanvasObject, undo } from "@/redux/canvasSlice";
import { updateSelectedTool } from "@/redux/settingsSlice";
import SelectIcon from "../icons/SelectIcon";
import { setIsSidePanelOpen } from "@/redux/settingsSlice";

export function LineWeightSliderValueLabel(props: SliderValueLabelProps) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

type ToolbarProps = {
  objects: CanvasObjectType[];
  onDelete: () => void;
  isDarkMode: boolean;
};

function Toolbar({ objects, onDelete, isDarkMode }: ToolbarProps) {
  const dispatch = useDispatch();

  const { undoStack, redoStack } = useSelector(
    (state: RootState) => state.canvas,
  );

  const toolbarBgColor = isDarkMode ? "bg-gray-500" : "bg-white";

  // shapes popover
  const [shapesAnchorEl, setShapesAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const isShapesAnchorElOpen = Boolean(shapesAnchorEl);
  const handleOpenShapesPopover = (
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

  // const handleChangeStrokeWidth = (value: number) => {
  //   setStrokeWidth(value);
  // };

  return (
    <div
      className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 ${toolbarBgColor}`}
    >
      <ButtonGroup
        variant="contained"
        aria-label="toolbar buttons"
        className="flex gap-2 p-1"
      >
        {/* select */}
        <Tooltip title="Select">
          <IconButton
            aria-label="Select"
            onClick={() => dispatch(updateSelectedTool("select"))}
          >
            <SelectIcon />
          </IconButton>
        </Tooltip>

        {/* pen */}
        <Tooltip title="Draw">
          <IconButton
            aria-label="Draw"
            onClick={() => {
              dispatch(setIsSidePanelOpen(true)); // Open side panel for configurations
              dispatch(updateSelectedTool("pen"));
              dispatch(selectCanvasObject("")); // clear selected object, if there is
            }}
          >
            <DrawIcon />
          </IconButton>
        </Tooltip>

        {/* text */}
        <Tooltip title="Add text">
          <IconButton
            aria-label="Add text"
            onClick={() => {
              dispatch(updateSelectedTool("addText"));
              dispatch(selectCanvasObject("")); // clear selected object, if there is
            }}
          >
            <TextFields />
          </IconButton>
        </Tooltip>

        {/* shapes */}
        <Tooltip title="Add shape">
          <IconButton
            aria-owns={isShapesAnchorElOpen ? "shapesPopover" : undefined}
            aria-haspopup="true"
            aria-label="Add shape"
            onClick={handleOpenShapesPopover}
          >
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

        {/* eraser */}
        <Tooltip title="Eraser">
          <IconButton
            aria-label="erase"
            onClick={() => {
              dispatch(updateSelectedTool("eraser"));
              dispatch(selectCanvasObject("")); // clear selected object, if there is
            }}
          >
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

      {/* lineWeightPopover */}
      {/* <Popover
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
            aria-label="Stroke width"
            value={strokeWidth}
            onChange={(_, value) => handleChangeStrokeWidth(value as number)}
          />
        </Box>
      </Popover> */}

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
              dispatch(updateSelectedTool("addRectangle"));
              dispatch(selectCanvasObject("")); // clear selected object, if there is
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
              dispatch(updateSelectedTool("addOval"));
              dispatch(selectCanvasObject("")); // clear selected object, if there is
            }}
          >
            <CircleOutlined />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add triangle">
          <IconButton
            aria-label="Add triangle"
            onClick={() => {
              handleCloseShapesPopover();
              dispatch(updateSelectedTool("addTriangle"));
              dispatch(selectCanvasObject("")); // clear selected object, if there is
            }}
          >
            <ChangeHistoryRounded />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add star">
          <IconButton
            aria-label="Add star"
            onClick={() => {
              handleCloseShapesPopover();
              dispatch(updateSelectedTool("addStar"));
              dispatch(selectCanvasObject("")); // clear selected object, if there is
            }}
          >
            <StarBorderPurple500Rounded />
          </IconButton>
        </Tooltip>
      </Popover>
    </div>
  );
}

export default Toolbar;
