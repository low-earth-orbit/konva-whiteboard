import { Button, Group, Modal, Text } from "@mantine/core";

type ConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
};

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: ConfirmationDialogProps) {
  return (
    <Modal opened={open} onClose={onClose} title={title} centered>
      <Text size="sm" mb="md">
        {description}
      </Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button
          color="orange"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </Button>
      </Group>
    </Modal>
  );
}
