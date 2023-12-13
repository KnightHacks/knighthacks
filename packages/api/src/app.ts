import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers";
import { cors } from "hono/cors";
import { createContextWithBindings } from "./context";

export type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.use("/trpc/*", async (c, next) => {
  const middleware = trpcServer({
    router: appRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: createContextWithBindings(c.env),
  });
  return await middleware(c, next);
});

export { app };
