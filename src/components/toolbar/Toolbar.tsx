import { useState } from "react";
import {
  ActionIcon,
  Group,
  Paper,
  Popover,
  Slider,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCircle,
  IconSquare,
  IconStar,
  IconTextSize,
  IconTriangle,
} from "@tabler/icons-react";

import EraserIcon from "../icons/EraserIcon";
import DrawIcon from "../icons/DrawIcon";
import DeleteIcon from "../icons/DeleteIcon";
import ShapesIcon from "../icons/ShapesIcon";
import SelectIcon from "../icons/SelectIcon";

import { CanvasObjectType } from "../Canvas";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { redo, selectCanvasObject, undo } from "@/redux/canvasSlice";
import { updateSelectedTool, setIsSidePanelOpen } from "@/redux/settingsSlice";
import { setEraserSize } from "@/redux/eraserSlice";

type ToolbarProps = {
  objects: CanvasObjectType[];
  onDelete: () => void;
};

function Toolbar({ objects, onDelete }: ToolbarProps) {
  const dispatch = useDispatch();
  const { eraserSize } = useSelector((state: RootState) => state.eraser);
  const { undoStack, redoStack } = useSelector(
    (state: RootState) => state.canvas,
  );

  const [shapesOpened, setShapesOpened] = useState(false);
  const [eraserOpened, setEraserOpened] = useState(false);

  return (
    <Paper
      shadow="sm"
      style={{
        position: "absolute",
        bottom: 8,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      p={4}
    >
      <Group gap={4} wrap="nowrap">
        {/* select */}
        <Tooltip label="Select">
          <ActionIcon
            variant="subtle"
            aria-label="Select"
            onClick={() => dispatch(updateSelectedTool("select"))}
          >
            <SelectIcon />
          </ActionIcon>
        </Tooltip>

        {/* pen */}
        <Tooltip label="Draw">
          <ActionIcon
            variant="subtle"
            aria-label="Draw"
            onClick={() => {
              dispatch(setIsSidePanelOpen(true));
              dispatch(updateSelectedTool("pen"));
              dispatch(selectCanvasObject(""));
            }}
          >
            <DrawIcon />
          </ActionIcon>
        </Tooltip>

        {/* text */}
        <Tooltip label="Add text">
          <ActionIcon
            variant="subtle"
            aria-label="Add text"
            onClick={() => {
              dispatch(updateSelectedTool("addText"));
              dispatch(selectCanvasObject(""));
            }}
          >
            <IconTextSize size={20} />
          </ActionIcon>
        </Tooltip>

        {/* shapes popover */}
        <Popover
          opened={shapesOpened}
          onChange={setShapesOpened}
          position="top"
          offset={8}
        >
          <Popover.Target>
            <Tooltip label="Add shape">
              <ActionIcon
                variant="subtle"
                aria-label="Add shape"
                aria-haspopup="true"
                onClick={() => setShapesOpened((o) => !o)}
              >
                <ShapesIcon />
              </ActionIcon>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown p={4}>
            <Group gap={4}>
              <Tooltip label="Add rectangle">
                <ActionIcon
                  variant="subtle"
                  aria-label="Add rectangle"
                  onClick={() => {
                    setShapesOpened(false);
                    dispatch(updateSelectedTool("addRectangle"));
                    dispatch(selectCanvasObject(""));
                  }}
                >
                  <IconSquare size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Add oval">
                <ActionIcon
                  variant="subtle"
                  aria-label="Add oval"
                  onClick={() => {
                    setShapesOpened(false);
                    dispatch(updateSelectedTool("addOval"));
                    dispatch(selectCanvasObject(""));
                  }}
                >
                  <IconCircle size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Add triangle">
                <ActionIcon
                  variant="subtle"
                  aria-label="Add triangle"
                  onClick={() => {
                    setShapesOpened(false);
                    dispatch(updateSelectedTool("addTriangle"));
                    dispatch(selectCanvasObject(""));
                  }}
                >
                  <IconTriangle size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Add star">
                <ActionIcon
                  variant="subtle"
                  aria-label="Add star"
                  onClick={() => {
                    setShapesOpened(false);
                    dispatch(updateSelectedTool("addStar"));
                    dispatch(selectCanvasObject(""));
                  }}
                >
                  <IconStar size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Popover.Dropdown>
        </Popover>

        {/* eraser with size popover */}
        <Popover
          opened={eraserOpened}
          onChange={setEraserOpened}
          position="top"
          offset={8}
        >
          <Popover.Target>
            <Tooltip label="Eraser">
              <ActionIcon
                variant="subtle"
                aria-label="Eraser"
                onClick={() => {
                  dispatch(updateSelectedTool("eraser"));
                  dispatch(selectCanvasObject(""));
                  setEraserOpened((o) => !o);
                }}
              >
                <EraserIcon />
              </ActionIcon>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown p="sm" style={{ width: 220 }}>
            <Slider
              label={(v) => `${v}px`}
              max={100}
              min={1}
              aria-label="Eraser size"
              value={eraserSize}
              onChange={(value) => dispatch(setEraserSize(value))}
            />
          </Popover.Dropdown>
        </Popover>

        {/* undo */}
        <Tooltip label="Undo">
          <ActionIcon
            variant="subtle"
            aria-label="Undo"
            disabled={undoStack.length === 0}
            onClick={() => dispatch(undo())}
          >
            <IconArrowBackUp size={20} />
          </ActionIcon>
        </Tooltip>

        {/* redo */}
        <Tooltip label="Redo">
          <ActionIcon
            variant="subtle"
            aria-label="Redo"
            disabled={redoStack.length === 0}
            onClick={() => dispatch(redo())}
          >
            <IconArrowForwardUp size={20} />
          </ActionIcon>
        </Tooltip>

        {/* delete */}
        <Tooltip label="Delete">
          <ActionIcon
            variant="subtle"
            color="orange"
            aria-label="Delete"
            disabled={objects.length === 0}
            onClick={onDelete}
          >
            <DeleteIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}

export default Toolbar;
