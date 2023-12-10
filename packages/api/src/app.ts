import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { appRouter } from "./routers";
import { createContext } from "./context";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());
app.use("*", cors()); // Correctly configure cors when our app is ready for production
app.get("/", (c) => c.json({ message: "Hello Hono!" }));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

export { app };
