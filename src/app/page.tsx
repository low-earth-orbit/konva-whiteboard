"use client";

import dynamic from "next/dynamic";
import GithubCorner from "react-github-corner";

const Canvas = dynamic(() => import("@/components/Canvas"), { ssr: false });

export default function Home() {
  return (
    <>
      <Canvas />
      <GithubCorner
        direction="right"
        ariaLabel="View source code on GitHub"
        bannerColor="#333"
        href="https://github.com/low-earth-orbit/konva-whiteboard"
        target="_blank"
        rel="noopener noreferrer"
      />
    </>
  );
}
