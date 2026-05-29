import { useState } from "react";
import { Button, ColorPicker, Popover } from "@mantine/core";

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
        <Button
          id={`myColorPickerButton-${id}`}
          variant="subtle"
          size="sm"
          mt="xs"
          onClick={() => setOpened((o) => !o)}
          leftSection={
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: color,
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            />
          }
        >
          {color}
        </Button>
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
