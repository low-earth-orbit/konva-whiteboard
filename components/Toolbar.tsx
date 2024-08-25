import { Button, Group } from "@mantine/core";
import { IconPencil, IconEraser, IconTrash } from "@tabler/icons-react";

type ToolbarProps = {
  selectTool: (tool: string) => void;
  resetCanvas: () => void;
};

const buttonStyle = {
  width: 50,
  height: 50,
};

function Toolbar({ selectTool, resetCanvas }: ToolbarProps) {
  return (
    <Group
      className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2"
      justify="center"
    >
      <Button variant="default" onClick={() => selectTool("pen")}>
        <IconPencil style={buttonStyle} />
      </Button>
      <Button variant="default" onClick={() => selectTool("eraser")}>
        <IconEraser style={buttonStyle} />
      </Button>
      <Button variant="default" onClick={resetCanvas}>
        <IconTrash style={buttonStyle} />
      </Button>
    </Group>
  );
}

export default Toolbar;
