import baseConfig from "@knighthacks/eslint-config/base";
import reactConfig from "@knighthacks/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
