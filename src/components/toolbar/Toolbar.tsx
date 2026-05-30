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
  IconChevronUp,
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

const shapeOptions = [
  { tool: "addRectangle", label: "Rectangle", Icon: IconSquare },
  { tool: "addOval", label: "Oval", Icon: IconCircle },
  { tool: "addTriangle", label: "Triangle", Icon: IconTriangle },
  { tool: "addStar", label: "Star", Icon: IconStar },
] as const;

const shapeTools: string[] = shapeOptions.map((s) => s.tool);

function Toolbar({ objects, onDelete }: ToolbarProps) {
  const dispatch = useDispatch();
  const { selectedTool } = useSelector((state: RootState) => state.settings);
  const { undoStack, redoStack } = useSelector(
    (state: RootState) => state.canvas,
  );

  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("light");

  const [shapesOpened, setShapesOpened] = useState(false);
  const [lastShapeTool, setLastShapeTool] =
    useState<(typeof shapeOptions)[number]["tool"]>("addRectangle");

  const isShapeToolActive = shapeTools.includes(selectedTool);
  const activeShape =
    shapeOptions.find((s) => s.tool === lastShapeTool) ?? shapeOptions[0];

  const handleSelectShape = (tool: (typeof shapeOptions)[number]["tool"]) => {
    setLastShapeTool(tool);
    setShapesOpened(false);
    dispatch(updateSelectedTool(tool));
    dispatch(selectCanvasObject(""));
  };

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
        <Tooltip label="Text">
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

        {/* shapes: MRU shape button + overflow popover */}
        <Popover
          opened={shapesOpened}
          onChange={setShapesOpened}
          position="top"
          offset={8}
        >
          <ActionIcon.Group>
            <Tooltip label={activeShape.label}>
              <ActionIcon
                variant={isShapeToolActive ? "filled" : "subtle"}
                aria-label={`Add ${activeShape.label.toLowerCase()}`}
                aria-pressed={isShapeToolActive}
                onClick={() => handleSelectShape(activeShape.tool)}
              >
                <activeShape.Icon size={20} />
              </ActionIcon>
            </Tooltip>
            <Popover.Target>
              <Tooltip label="More" disabled={shapesOpened}>
                <ActionIcon
                  variant={isShapeToolActive ? "filled" : "subtle"}
                  aria-label="More shapes"
                  aria-haspopup="true"
                  aria-expanded={shapesOpened}
                  onClick={() => setShapesOpened((o) => !o)}
                >
                  <IconChevronUp size={14} />
                </ActionIcon>
              </Tooltip>
            </Popover.Target>
          </ActionIcon.Group>
          <Popover.Dropdown p={4}>
            <Group gap={4}>
              {shapeOptions.map(({ tool, label, Icon }) => (
                <Tooltip key={tool} label={label}>
                  <ActionIcon
                    variant={lastShapeTool === tool ? "light" : "subtle"}
                    aria-label={`Add ${label.toLowerCase()}`}
                    onClick={() => handleSelectShape(tool)}
                  >
                    <Icon size={20} />
                  </ActionIcon>
                </Tooltip>
              ))}
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
