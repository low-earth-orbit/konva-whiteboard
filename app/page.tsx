"use client";

import Canvas from "@/components/Canvas";
import store from "@/redux/store";
import { Provider } from "react-redux";
import GithubCorner from "react-github-corner";

export default function Home() {
  return (
    <>
      <Provider store={store}>
        <Canvas />
      </Provider>
      <GithubCorner
        direction="right"
        ariaLabel="View source code on GitHub"
        bannerColor="#333"
        href="https://github.com/low-earth-orbit/konva-whiteboard"
      />
    </>
  );
}
