import type { NextConfig } from "next";

const isGithubPages =
  process.env.NODE_ENV === "production" && process.env.GITHUB_PAGES === "true";

const basePath = isGithubPages ? "/konva-whiteboard" : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactCompiler: true,
  // Exposed to the client so non-Next asset references (e.g. CSS cursor
  // url()s) can be prefixed with the GitHub Pages base path.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isGithubPages && {
    basePath,
    assetPrefix: "/konva-whiteboard/",
  }),
};

export default nextConfig;
