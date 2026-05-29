"use client";

import { MantineProvider } from "@mantine/core";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/redux/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="auto">
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </MantineProvider>
  );
}
