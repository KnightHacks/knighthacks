import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers";

const app = new Hono();

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
