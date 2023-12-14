import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers";
import { cors } from "hono/cors";
import { createContext } from "./context";

export type Bindings = {
  DATABASE_URL: string;
  GITHUBID: string;
  GITHUB_SECRET: string;
  SUPABASE_JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello world");
});

app.use("/trpc/*", async (c, next) => {
  const middleware = trpcServer({
    router: appRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: createContext(c.env),
  });
  return await middleware(c, next);
});

export { app };
