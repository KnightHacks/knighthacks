import baseConfig from "@knighthacks/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**", ".wrangler/**"],
  },
  ...baseConfig,
];
