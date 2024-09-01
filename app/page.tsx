"use client";

import Canvas from "@/components/Canvas";
import store from "@/redux/store";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}>
      <Canvas />
    </Provider>
  );
}
