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
import { LineWeightSliderValueLabel } from "../Toolbar";
import MyColorPicker from "@/components/MyColorPicker";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { CanvasObjectType } from "@/components/Canvas";
import { setInkColor, setInkWidth } from "@/redux/inkSlice";
import { updateCanvasObject } from "@/redux/canvasSlice";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedObjectId: string;
};

export default function InkPanel({ isOpen, onClose, selectedObjectId }: Props) {
  const dispatch = useDispatch();

  function updateInkStyle(property: keyof CanvasObjectType, value: any) {
    // Dynamically update state
    if (property === "strokeWidth") {
      dispatch(setInkWidth(value));
    } else if (property === "stroke") {
      dispatch(setInkColor(value));
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

  const { inkWidth, inkColor } = useSelector((state: RootState) => state.ink);

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
        <Typography variant="subtitle1">Inking</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Stroke Width Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Size</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            sx={{ mr: 2, width: 30, textAlign: "center", fontSize: "0.875rem" }}
          >
            {inkWidth}px
          </Typography>
          <Slider
            value={inkWidth}
            min={1}
            max={100}
            valueLabelDisplay="auto"
            slots={{
              valueLabel: LineWeightSliderValueLabel,
            }}
            aria-label="Stroke size"
            onChange={(_, value) =>
              updateInkStyle("strokeWidth", value as number)
            }
            sx={{ flex: 1, mr: 2 }}
          />
        </Box>
      </Box>

      {/* Stroke Color Section */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Color</Typography>
        <MyColorPicker
          id="inkColorPicker"
          color={inkColor}
          onChange={(newColor) => updateInkStyle("stroke", newColor)}
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
