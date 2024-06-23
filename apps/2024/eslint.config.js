import baseConfig, { restrictEnvAccess } from "@knighthacks/eslint-config/base";
import nextjsConfig from "@knighthacks/eslint-config/nextjs";
import reactConfig from "@knighthacks/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**", "/.vercel/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
