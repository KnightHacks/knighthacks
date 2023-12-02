import sharedConfig from "../../packages/tailwind-config/tailwind.config";
import { Config } from "tailwindcss";

const config: Pick<Config, "presets"> = {
  presets: [sharedConfig],
};

export default config;
