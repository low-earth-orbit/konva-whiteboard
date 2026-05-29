import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  NumberInput,
  Paper,
  Text,
  Transition,
} from "@mantine/core";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconItalic,
  IconUnderline,
  IconX,
} from "@tabler/icons-react";
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

  function toggleStyle(style: string) {
    const newStyle = textStyle.includes(style)
      ? textStyle.filter((s) => s !== style)
      : [...textStyle, style];

    dispatch(setTextStyle(newStyle));
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: { fontStyle: getFontStyleStringFromTextStyleArray(newStyle) },
      }),
    );
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: {
          textDecoration: getTextDecorationStringFromTextStyleArray(newStyle),
        },
      }),
    );
  }

  function setAlignment(align: "left" | "center" | "right") {
    dispatch(setTextAlignment(align));
    dispatch(
      updateCanvasObject({
        id: selectedObjectId,
        updates: { align },
      }),
    );
  }

  function handleTextSizeChange(value: string | number) {
    const n = Number(value);
    if (!isNaN(n)) {
      dispatch(setTextSize(n));
      dispatch(
        updateCanvasObject({
          id: selectedObjectId,
          updates: { fontSize: n },
        }),
      );
    }
  }

  function handleLineSpacingChange(value: string | number) {
    const n = Number(value);
    if (!isNaN(n)) {
      dispatch(setLineSpacing(n));
      dispatch(
        updateCanvasObject({
          id: selectedObjectId,
          updates: { lineHeight: n },
        }),
      );
    }
  }

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
            <Text fw={500}>Edit text</Text>
            <ActionIcon variant="subtle" onClick={onClose} aria-label="Close">
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <Divider />
          <Box p="md">
            <Text size="sm" fw={600} mb="xs">
              Size
            </Text>
            <NumberInput
              value={textSize}
              onChange={handleTextSizeChange}
              min={8}
              max={100}
              step={1}
              w={80}
              aria-label="Font size"
            />
          </Box>

          <Divider />
          <Box p="md">
            <Text size="sm" fw={600} mb="xs">
              Style
            </Text>
            <div role="group" aria-label="Text style">
              <Button.Group>
                <Button
                  variant={textStyle.includes("bold") ? "filled" : "default"}
                  size="xs"
                  aria-label="Bold"
                  aria-pressed={textStyle.includes("bold")}
                  onClick={() => toggleStyle("bold")}
                >
                  <IconBold size={16} />
                </Button>
                <Button
                  variant={textStyle.includes("italic") ? "filled" : "default"}
                  size="xs"
                  aria-label="Italic"
                  aria-pressed={textStyle.includes("italic")}
                  onClick={() => toggleStyle("italic")}
                >
                  <IconItalic size={16} />
                </Button>
                <Button
                  variant={
                    textStyle.includes("underline") ? "filled" : "default"
                  }
                  size="xs"
                  aria-label="Underline"
                  aria-pressed={textStyle.includes("underline")}
                  onClick={() => toggleStyle("underline")}
                >
                  <IconUnderline size={16} />
                </Button>
              </Button.Group>
            </div>
          </Box>

          <Divider />
          <Box p="md">
            <Text size="sm" fw={600}>
              Color
            </Text>
            <MyColorPicker
              id="textColorPicker"
              color={textColor}
              onChange={(newColor) => {
                dispatch(setTextColor(newColor));
                dispatch(
                  updateCanvasObject({
                    id: selectedObjectId,
                    updates: { fill: newColor },
                  }),
                );
              }}
            />
          </Box>

          <Divider />
          <Box p="md">
            <Text size="sm" fw={600} mb="xs">
              Alignment
            </Text>
            <div role="group" aria-label="Text alignment">
              <Button.Group>
                <Button
                  variant={textAlignment === "left" ? "filled" : "default"}
                  size="xs"
                  aria-label="Align left"
                  onClick={() => setAlignment("left")}
                >
                  <IconAlignLeft size={16} />
                </Button>
                <Button
                  variant={textAlignment === "center" ? "filled" : "default"}
                  size="xs"
                  aria-label="Align center"
                  onClick={() => setAlignment("center")}
                >
                  <IconAlignCenter size={16} />
                </Button>
                <Button
                  variant={textAlignment === "right" ? "filled" : "default"}
                  size="xs"
                  aria-label="Align right"
                  onClick={() => setAlignment("right")}
                >
                  <IconAlignRight size={16} />
                </Button>
              </Button.Group>
            </div>
          </Box>

          <Divider />
          <Box p="md">
            <Text size="sm" fw={600} mb="xs">
              Line spacing
            </Text>
            <NumberInput
              value={lineSpacing}
              onChange={handleLineSpacingChange}
              min={1}
              max={3}
              step={0.5}
              w={80}
              aria-label="Line spacing"
            />
          </Box>
        </Paper>
      )}
    </Transition>
  );
}
