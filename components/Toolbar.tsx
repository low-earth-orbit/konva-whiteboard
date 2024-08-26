import EraserIcon from "./icons/EraserIcon";
import DrawIcon from "./icons/DrawIcon";
import DeleteIcon from "./icons/DeleteIcon";
import { ButtonGroup, IconButton, Popover } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";

type ToolbarProps = {
  selectTool: (tool: string) => void;
  resetCanvas: () => void;
  color: string;
  selectColor: (newColor: string) => void;
};

function Toolbar({
  selectTool,
  resetCanvas,
  color,
  selectColor,
}: ToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 ">
      <ButtonGroup
        variant="contained"
        aria-label="toolbar buttons"
        className="flex gap-2"
      >
        <IconButton aria-label="draw" onClick={() => selectTool("pen")}>
          <DrawIcon />
        </IconButton>

        {/* color picker */}
        <IconButton aria-label="open color palette" onClick={handleClick}>
          <PaletteIcon />
        </IconButton>

        <IconButton aria-label="erase" onClick={() => selectTool("eraser")}>
          <EraserIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={resetCanvas}>
          <DeleteIcon />
        </IconButton>
      </ButtonGroup>

      <Popover
        id="colorPickerPopover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <HexColorPicker className="p-1" color={color} onChange={selectColor} />
      </Popover>
    </div>
  );
}

export default Toolbar;
