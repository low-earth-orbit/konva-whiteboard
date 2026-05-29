import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Paper,
  Slider,
  Text,
  Transition,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
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

  function updateInkStyle(property: keyof CanvasObjectType, value: unknown) {
    if (property === "strokeWidth") {
      dispatch(setInkWidth(value as number));
    } else if (property === "stroke") {
      dispatch(setInkColor(value as string));
    }

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

  return (
    <Transition mounted={isOpen} transition="slide-right" duration={200}>
      {(styles) => (
        <Paper
          shadow="sm"
          radius="md"
          withBorder
          style={{
            ...styles,
            position: "fixed",
            top: 8,
            left: 8,
            width: 300,
            height: "calc(100% - 16px)",
            zIndex: 200,
            overflowY: "auto",
          }}
        >
          <Group justify="space-between" align="center" p="md">
            <Text fw={500}>Inking</Text>
            <ActionIcon variant="subtle" onClick={onClose} aria-label="Close">
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <Divider />
          <Box p="md">
            <Text size="sm" fw={600} mb="xs">
              Size
            </Text>
            <Group align="center" gap="sm">
              <Text size="sm" w={40} ta="center">
                {inkWidth}px
              </Text>
              <Slider
                value={inkWidth}
                min={1}
                max={100}
                label={(v) => `${v}px`}
                aria-label="Stroke size"
                onChange={(value) => updateInkStyle("strokeWidth", value)}
                style={{ flex: 1 }}
              />
            </Group>
          </Box>

          <Divider />
          <Box p="md">
            <Text size="sm" fw={600}>
              Color
            </Text>
            <MyColorPicker
              id="inkColorPicker"
              color={inkColor}
              onChange={(newColor) => updateInkStyle("stroke", newColor)}
            />
          </Box>
        </Paper>
      )}
    </Transition>
  );
}
