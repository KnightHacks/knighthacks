import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  })
);

export { app };
