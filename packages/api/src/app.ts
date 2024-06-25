import { clerkMiddleware } from "@hono/clerk-auth";
import { trpcServer } from "@hono/trpc-server";
import { buildDatabaseClient } from "@knighthacks/db";
import { Hono } from "hono";
import { cors } from "hono/cors";

import type { HonoConfig, HonoContext } from "./config";
import { resume } from "./routes/resume";
import { createTRPCContextFromHonoContext } from "./trpc/context";
import { appRouter } from "./trpc/routers";

const app = new Hono<HonoConfig>()
  .get("/", (c) => {
    return c.text("Hello world");
  })
  .use(
    "*",
    cors({
      origin(origin, c: HonoContext) {
        if (c.env.ENV === "dev") {
          return origin;
        }

        if (
          origin.endsWith("2024-dxt.pages.dev") ||
          origin.endsWith("knighthacks-admin.pages.dev") ||
          origin.endsWith("knighthacks.org")
        ) {
          return origin;
        }

        return "https://knighthacks.org";
      },
    }),
  )
  .use("*", (c, next) => {
    const db = buildDatabaseClient(
      c.env.DATABASE_URL,
      c.env.DATABASE_AUTH_TOKEN,
    );
    c.set("db", db);
    return next();
  })
  .use("*", (c, next) => {
    return clerkMiddleware({
      publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
      secretKey: c.env.CLERK_SECRET_KEY,
    })(c, next);
  })
  .use("/trpc/*", (c, next) => {
    return trpcServer({
      router: appRouter,
      onError({ error }) {
        console.error(error);
      },
      createContext: createTRPCContextFromHonoContext(c),
    })(c, next);
  })
  .route("/resume", resume);

export { app };
