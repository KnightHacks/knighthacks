import { Hono } from "hono";

import type { HonoConfig } from "~/config";
import { helloWorld } from "./routes/hello-world";
import { interaction } from "./routes/interaction";

const app = new Hono<HonoConfig>()
  .route("/", helloWorld)
  .route("/", interaction);

export { app };
