import { Layer } from "react-konva";
import { CanvasObjectType } from "../Canvas";
import TextField from "./TextField";

type Props = {
  objects: CanvasObjectType[];
  newObject: CanvasObjectType | null;
  selectedObjectId: string;
  setSelectedObjectId: (id: string) => void;
  onChange: (
    newAttrs: Partial<CanvasObjectType>,
    selectedObjectId: string,
  ) => void;
};

export default function TextFieldsLayer({
  objects,
  newObject,
  selectedObjectId,
  setSelectedObjectId,
  onChange,
}: Props) {
  const texts = [
    ...objects.filter((obj: CanvasObjectType) => obj.type === "text"),
    ...(newObject && newObject.type === "text" ? [newObject] : []),
  ];

  return (
    <Layer>
      {texts.map((text, _) => (
        <TextField
          key={text.id}
          objectProps={text}
          isSelected={text.id === selectedObjectId}
          onSelect={() => setSelectedObjectId(text.id)}
          onChange={(newAttrs: Partial<CanvasObjectType>) =>
            onChange(newAttrs, text.id)
          }
        />
      ))}
    </Layer>
  );
}
