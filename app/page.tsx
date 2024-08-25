import Canvas from "@/components/Canvas";
import { MantineProvider } from "@mantine/core";

export default function Home() {
  return (
    <MantineProvider>
      <Canvas />
    </MantineProvider>
  );
}
