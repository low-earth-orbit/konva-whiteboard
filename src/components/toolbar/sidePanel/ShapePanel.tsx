import {
  ActionIcon,
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

  function updateShapeStyle(property: keyof CanvasObjectType, value: unknown) {
    if (property === "strokeWidth") {
      dispatch(setBorderWidth(value as number));
    } else if (property === "stroke") {
      dispatch(setBorderColor(value as string));
    } else if (property === "fill") {
      dispatch(setFillColor(value as string));
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

  const { borderWidth, borderColor, fillColor } = useSelector(
    (state: RootState) => state.shape,
  );

  return (
    <Transition mounted={isOpen} transition="slide-right" duration={200}>
      {(styles) => (
        <Paper
          shadow="sm"
          radius="md"
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
            <Text fw={500}>Edit shape</Text>
            <ActionIcon variant="subtle" onClick={onClose} aria-label="Close">
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <Divider />
          <div style={{ padding: 16 }}>
            <Text size="sm" fw={600} mb="xs">
              Border width
            </Text>
            <Group align="center" gap="sm">
              <Text size="sm" w={40} ta="center">
                {borderWidth}px
              </Text>
              <Slider
                value={borderWidth}
                min={1}
                max={100}
                label={(v) => `${v}px`}
                aria-label="Border width"
                onChange={(value) => updateShapeStyle("strokeWidth", value)}
                style={{ flex: 1 }}
              />
            </Group>
          </div>

          <Divider />
          <div style={{ padding: 16 }}>
            <Text size="sm" fw={600}>
              Color
            </Text>
            <MyColorPicker
              id="shapeBorderColorPicker"
              color={borderColor}
              onChange={(newColor) => updateShapeStyle("stroke", newColor)}
            />
          </div>

          <Divider />
          <div style={{ padding: 16 }}>
            <Text size="sm" fw={600}>
              Fill
            </Text>
            <MyColorPicker
              id="shapeFillColorPicker"
              color={fillColor}
              onChange={(newColor) => updateShapeStyle("fill", newColor)}
            />
          </div>
        </Paper>
      )}
    </Transition>
  );
}
