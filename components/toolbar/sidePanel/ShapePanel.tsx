import * as React from "react";
import {
  Box,
  Drawer,
  Typography,
  Divider,
  IconButton,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NumberSliderValueLabel } from "../Toolbar";
import MyColorPicker from "@/components/MyColorPicker";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { CanvasObjectType } from "@/components/Canvas";
import {
  setBorderColor,
  setBorderWidth,
  setFillColor,
} from "@/redux/shapeSlice";
import { updateCanvasObject } from "@/redux/canvasSlice";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedObjectId: string;
};

export default function ShapePanel({
  isOpen,
  onClose,
  selectedObjectId,
}: Props) {
  const dispatch = useDispatch();

  function updateShapeStyle(property: keyof CanvasObjectType, value: any) {
    // Dynamically update state
    if (property === "strokeWidth") {
      dispatch(setBorderWidth(value));
    } else if (property === "stroke") {
      dispatch(setBorderColor(value));
    } else if (property === "fill") {
      dispatch(setFillColor(value));
    }

    // Update object property
    if (selectedObjectId !== "") {
      dispatch(
        updateCanvasObject({
          id: selectedObjectId,
          updates: { [property]: value },
        }),
      );
    }
  }

  const { borderWidth, borderColor, fillColor } = useSelector(
    (state: RootState) => state.shape,
  );

  const drawer = (
    <>
      {/* Title with Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="subtitle1">Edit shape</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Border Width Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Border width</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            sx={{ mr: 2, width: 30, textAlign: "center", fontSize: "0.875rem" }}
          >
            {borderWidth}px
          </Typography>
          <Slider
            value={borderWidth}
            min={1}
            max={100}
            valueLabelDisplay="auto"
            slots={{
              valueLabel: NumberSliderValueLabel,
            }}
            aria-label="Border width"
            onChange={(_, value) =>
              updateShapeStyle("strokeWidth", value as number)
            }
            sx={{ flex: 1, mr: 2 }}
          />
        </Box>
      </Box>

      {/* Border Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Color</Typography>
        <MyColorPicker
          id="shapeBorderColorPicker"
          color={borderColor}
          onChange={(newColor) => updateShapeStyle("stroke", newColor)}
        />
      </Box>

      {/* Fill Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Fill</Typography>
        <MyColorPicker
          id="shapeFillColorPicker"
          color={fillColor}
          onChange={(newColor) => updateShapeStyle("fill", newColor)}
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
          width: 300, // Fixed width for the panel
          borderRadius: "10px", // Rounded corner
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
