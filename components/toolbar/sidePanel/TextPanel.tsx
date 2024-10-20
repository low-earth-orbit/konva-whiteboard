import * as React from "react";
import {
  Box,
  Drawer,
  Typography,
  Divider,
  IconButton,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setLineSpacing,
  setTextAlignment,
  setTextColor,
  setTextSize,
  setTextStyle,
} from "@/redux/textSlice";
import { updateCanvasObject } from "@/redux/canvasSlice";
import {
  getFontStyleStringFromTextStyleArray,
  getTextDecorationStringFromTextStyleArray,
} from "../../text/textUtils";
import MyColorPicker from "@/components/MyColorPicker";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedObjectId: string;
};

export default function TextPanel({
  isOpen,
  onClose,
  selectedObjectId,
}: Props) {
  const dispatch = useDispatch();
  const { textSize, textStyle, textColor, textAlignment, lineSpacing } =
    useSelector((state: RootState) => state.text);

  const handleTextStyleChange = (
    event: React.MouseEvent<HTMLElement>,
    newStyle: string[],
  ) => {
    // update textStyle in redux store
    dispatch(setTextStyle(newStyle));

    // update selected object
    // fontStyle (bold / italic)
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: { fontStyle: getFontStyleStringFromTextStyleArray(newStyle) },
      }),
    );

    // textDecoration (underline)
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: {
          textDecoration: getTextDecorationStringFromTextStyleArray(newStyle),
        },
      }),
    );
  };

  const handleColorChange = (newColor: string) => {
    dispatch(setTextColor(newColor));
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: { fill: newColor },
      }),
    );
  };

  const handleTextAlignChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: "left" | "center" | "right",
  ) => {
    dispatch(setTextAlignment(newValue));
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: { align: newValue },
      }),
    );
  };

  const handleLineSpacingChange = (e: any) => {
    const value = Number(e.target.value);
    dispatch(setLineSpacing(value));
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: { lineHeight: value },
      }),
    );
  };

  const handleTextSizeChange = (e: any) => {
    const value = Number(e.target.value);
    dispatch(setTextSize(value));
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: { fontSize: value },
      }),
    );
  };

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="subtitle1">Edit text</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Text Size Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Size</Typography>
        <TextField
          type="number"
          value={textSize}
          onChange={handleTextSizeChange}
          InputProps={{ inputProps: { min: 8, max: 100, step: 1 } }}
          sx={{ width: 80, mt: 1 }}
        />
      </Box>

      {/* Text Style Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Style</Typography>
        <ToggleButtonGroup
          value={textStyle}
          onChange={handleTextStyleChange}
          aria-label="text formatting"
          sx={{ mt: 1 }}
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underline" aria-label="underline">
            <FormatUnderlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Text Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Color</Typography>
        <MyColorPicker
          color={textColor}
          onChange={(newColor) => handleColorChange(newColor)}
        />
      </Box>

      {/* Text Alignment Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Alignment</Typography>
        <ToggleButtonGroup
          value={textAlignment}
          exclusive
          onChange={handleTextAlignChange}
          aria-label="text alignment"
          sx={{ mt: 1 }}
        >
          <ToggleButton value="left" aria-label="left align">
            <FormatAlignLeftIcon />
          </ToggleButton>
          <ToggleButton value="center" aria-label="center align">
            <FormatAlignCenterIcon />
          </ToggleButton>
          <ToggleButton value="right" aria-label="right align">
            <FormatAlignRightIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Line Spacing Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Line spacing</Typography>
        <TextField
          type="number"
          value={lineSpacing}
          onChange={handleLineSpacingChange}
          InputProps={{ inputProps: { min: 1, max: 3, step: 0.5 } }}
          sx={{ width: 80, mt: 1 }}
        />
      </Box>
    </>
  );

  return (
    <Drawer
      open={isOpen}
      anchor="left"
      onClose={onClose}
      variant="persistent"
      PaperProps={{
        sx: {
          width: 300,
          borderRadius: "10px",
          boxShadow: 2,
          margin: 1,
          height: "calc(100% - 16px)",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
