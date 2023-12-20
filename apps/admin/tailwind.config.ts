import type { Config } from "tailwindcss";

import baseConfig from "@knighthacks/tailwind-config";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
