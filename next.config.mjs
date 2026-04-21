/** @type {import('next').NextConfig} */

const isGithubPages =
  process.env.NODE_ENV === "production" && process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export", // enables static exports
  ...(isGithubPages && {
    basePath: "/konva-whiteboard",
    assetPrefix: "/konva-whiteboard/",
  }),
};

export default nextConfig;
