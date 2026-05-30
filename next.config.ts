import type { NextConfig } from "next";

const isGithubPages =
  process.env.NODE_ENV === "production" && process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactCompiler: true,
  ...(isGithubPages && {
    basePath: "/konva-whiteboard",
    assetPrefix: "/konva-whiteboard/",
  }),
};

export default nextConfig;
