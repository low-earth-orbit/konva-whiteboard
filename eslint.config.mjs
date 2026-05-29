import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = [
  { ignores: ["*.config.mjs", "*.config.ts", "*.config.js"] },
  ...nextConfig,
  prettierConfig,
];

export default eslintConfig;
