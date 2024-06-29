import baseConfig from "@knighthacks/tailwind-config/web";
import { Config } from "tailwindcss";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {},
} satisfies Config;
