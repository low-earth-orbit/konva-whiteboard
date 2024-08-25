import EraserIcon from "./icons/EraserIcon";
import DrawIcon from "./icons/DrawIcon";
import DeleteIcon from "./icons/DeleteIcon";
import { ButtonGroup, IconButton } from "@mui/material";

type ToolbarProps = {
  selectTool: (tool: string) => void;
  resetCanvas: () => void;
};

function Toolbar({ selectTool, resetCanvas }: ToolbarProps) {
  return (
    <ButtonGroup
      variant="contained"
      aria-label="toolbar buttons"
      className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2"
    >
      <IconButton aria-label="draw" onClick={() => selectTool("pen")}>
        <DrawIcon />
      </IconButton>
      <IconButton aria-label="erase" onClick={() => selectTool("eraser")}>
        <EraserIcon />
      </IconButton>
      <IconButton aria-label="delete" onClick={resetCanvas}>
        <DeleteIcon />
      </IconButton>
    </ButtonGroup>
  );
}

export default Toolbar;
