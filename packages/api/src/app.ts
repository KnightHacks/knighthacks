import { Hono } from "hono";
import { cors } from "hono/cors";

import type { HonoConfig } from "./config";
import { clerk } from "./middlewares/clerk";
import { db } from "./middlewares/db";
import { trpc } from "./middlewares/trpc";
import { resume } from "./routes/resume";
import { webhook } from "./routes/webhook";

const app = new Hono<HonoConfig>()
  .get("/", (c) => {
    return c.text("Hello world");
  })
  .use(
    "*",
    cors({
      origin: ["http://localhost:3000"],
    }),
  )
  .use("*", db)
  .use("*", clerk)
  .use("/trpc/*", trpc)
  .route("/resume", resume)
  .route("/webhook", webhook);

export { app };
