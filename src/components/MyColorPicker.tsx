import { useState } from "react";
import {
  ColorPicker,
  ColorSwatch,
  Group,
  Popover,
  Text,
  UnstyledButton,
} from "@mantine/core";

const swatches: string[] = [
  "#000000",
  "#4D4D4D",
  "#808080",
  "#B3B3B3",
  "#CCCCCC",
  "#E6E6E6",
  "#F2F2F2",
  "#FFFFFF",
  "#FF0000",
  "#FF7F00",
  "#FFFF00",
  "#00FF00",
  "#00FFFF",
  "#0000FF",
  "#8B00FF",
  "#FF00FF",
  "#FFCCCC",
  "#FFCC99",
  "#FFFFCC",
  "#CCFFCC",
  "#CCFFFF",
  "#CCCCFF",
  "#E5CCFF",
  "#FFCCE5",
];

type Props = {
  id: string;
  color: string;
  onChange: (newColor: string) => void;
};

function MyColorPicker({ id, color, onChange }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      offset={5}
    >
      <Popover.Target>
        <UnstyledButton
          id={`myColorPickerButton-${id}`}
          onClick={() => setOpened((o) => !o)}
          mt="xs"
          aria-label={`Pick color, current ${color}`}
        >
          <Group gap="xs" wrap="nowrap">
            <ColorSwatch color={color} size={28} withShadow />
            <Text size="sm" c="dimmed" tt="uppercase">
              {color}
            </Text>
          </Group>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <ColorPicker
          id={`colorPicker-${id}`}
          format="hex"
          value={color}
          onChange={onChange}
          swatches={swatches}
          swatchesPerRow={8}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

export default MyColorPicker;
