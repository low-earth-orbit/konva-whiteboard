import { useState } from "react";
import {
  ActionIcon,
  Divider,
  Group,
  Paper,
  Popover,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCircle,
  IconMoon,
  IconSquare,
  IconStar,
  IconSun,
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

type ToolbarProps = {
  objects: CanvasObjectType[];
  onDelete: () => void;
};

const shapeTools = ["addRectangle", "addOval", "addTriangle", "addStar"];

function Toolbar({ objects, onDelete }: ToolbarProps) {
  const dispatch = useDispatch();
  const { selectedTool } = useSelector((state: RootState) => state.settings);
  const { undoStack, redoStack } = useSelector(
    (state: RootState) => state.canvas,
  );

  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("light");

  const [shapesOpened, setShapesOpened] = useState(false);

  const isShapeToolActive = shapeTools.includes(selectedTool);

  return (
    <Paper
      shadow="sm"
      withBorder
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
            variant={selectedTool === "select" ? "filled" : "subtle"}
            aria-label="Select"
            aria-pressed={selectedTool === "select"}
            onClick={() => dispatch(updateSelectedTool("select"))}
          >
            <SelectIcon />
          </ActionIcon>
        </Tooltip>

        {/* pen */}
        <Tooltip label="Draw">
          <ActionIcon
            variant={selectedTool === "pen" ? "filled" : "subtle"}
            aria-label="Draw"
            aria-pressed={selectedTool === "pen"}
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
            variant={selectedTool === "addText" ? "filled" : "subtle"}
            aria-label="Add text"
            aria-pressed={selectedTool === "addText"}
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
                variant={isShapeToolActive ? "filled" : "subtle"}
                aria-label="Add shape"
                aria-haspopup="true"
                aria-pressed={isShapeToolActive}
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

        {/* eraser */}
        <Tooltip label="Eraser">
          <ActionIcon
            variant={selectedTool === "eraser" ? "filled" : "subtle"}
            aria-label="Eraser"
            aria-pressed={selectedTool === "eraser"}
            onClick={() => {
              dispatch(updateSelectedTool("eraser"));
              dispatch(selectCanvasObject(""));
            }}
          >
            <EraserIcon />
          </ActionIcon>
        </Tooltip>

        <Divider orientation="vertical" mx={4} />

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

        <Divider orientation="vertical" mx={4} />

        {/* theme toggle */}
        <Tooltip label={colorScheme === "dark" ? "Light mode" : "Dark mode"}>
          <ActionIcon
            variant="subtle"
            aria-label="Toggle color scheme"
            onClick={() =>
              setColorScheme(colorScheme === "dark" ? "light" : "dark")
            }
          >
            {colorScheme === "dark" ? (
              <IconSun size={20} />
            ) : (
              <IconMoon size={20} />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}

export default Toolbar;
