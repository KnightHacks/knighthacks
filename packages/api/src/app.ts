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
        c.set('origin', origin);
        if (c.env.ENV === "dev") {
          return origin;
        } else if (
          origin.endsWith("2024-dxt.pages.dev") ||
          origin.endsWith("knighthacks-admin.pages.dev")
        ) {
          return origin;
        } else if (origin.endsWith(".knighthacks.org")) {
          return origin;
        } else {
          return "https://knighthacks.org";
        }
      },
    }),
  )
  .use("*", (c, next) => {
    const origin = c.get("origin");
    if (
      origin.endsWith("2024-dxt.pages.dev") ||
      origin.endsWith("knighthacks-admin.pages.dev")
    )
      c.set(
        "db",
        buildDatabaseClient(
          c.env.DEV_DATABASE_URL,
          c.env.DEV_DATABASE_AUTH_TOKEN,
        ),
      );
    else {
      c.set(
        "db",
        buildDatabaseClient(c.env.DATABASE_URL, c.env.DATABASE_AUTH_TOKEN),
      );
    }

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
