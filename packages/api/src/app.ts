import { clerkMiddleware } from "@hono/clerk-auth";
import { trpcServer } from "@hono/trpc-server";
import { buildDatabaseClient } from "@knighthacks/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";

import type { HonoConfig, HonoContext } from "./config";
import { resume } from "./routes/resume";
import { createContext } from "./trpc/context";
import { router } from "./trpc/routers";

const app = new Hono<HonoConfig>()
  .get("/", (c) => {
    return c.text("Hello world");
  })
  .use(
    "*",
    csrf({
      origin: (origin, c: HonoContext) => {
        if (
          c.env.ENV === "dev" ||
          origin.endsWith("2024-dxt.pages.dev") ||
          origin.endsWith("knighthacks-admin.pages.dev") ||
          origin.endsWith("knighthacks.org")
        ) {
          return true;
        } else {
          return false;
        }
      },
    }),
  )
  .use(
    "*",
    cors({
      origin: (origin, c: HonoContext) => {
        if (
          c.env.ENV === "dev" ||
          origin.endsWith("2024-dxt.pages.dev") ||
          origin.endsWith("knighthacks-admin.pages.dev") ||
          origin.endsWith("knighthacks.org")
        ) {
          return origin;
        } else {
          return "https://knighthacks.org";
        }
      },
    }),
  )
  .use("*", clerkMiddleware())
  .use("*", (c, next) => {
    c.set(
      "db",
      buildDatabaseClient(c.env.DATABASE_URL, c.env.DATABASE_AUTH_TOKEN),
    );
    return next();
  })
  .use(
    "/trpc/*",
    trpcServer({
      router,
      createContext,
    }),
  )
  .route("/resume", resume)
  .get("/sigma", (c) => {
    return c.json({ message: "What the sigma!" });
  });

export { app };
