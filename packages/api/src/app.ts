import { Hono } from "hono";
import { cors } from "hono/cors";

import type { HonoConfig } from "./config";
import { clerk } from "./middlewares/clerk";
import { db } from "./middlewares/db";
import { trpc } from "./middlewares/trpc";
import { resume } from "./routes/resume";

const app = new Hono<HonoConfig>()
  .use(
    "*",
    cors({
      origin: ["http://localhost:3000"],
    }),
  )
  .use("*", db)
  .use("*", clerk)
  .use("/trpc/*", trpc)

  .get("/", (c) => {
    return c.text("Hello world");
  })
  .route("/resume", resume);

export { app };
