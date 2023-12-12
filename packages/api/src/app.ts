import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers";
import { cors } from "hono/cors";
import { createContext } from "./context";

const app = new Hono();

app.use("*", cors());
app.use("*", clerkMiddleware());
app.get("/", (c) => {
  return c.text("Hello World!");
});

app.get("/", (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      message: "You are not logged in.",
    });
  }

  return c.json({
    message: "You are logged in!",
    userId: auth.userId,
  });
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

export { app };
