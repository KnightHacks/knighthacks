import { t } from "../trpc";
import { usersRouter } from "./users";

export const appRouter = t.router({
  hello: t.procedure.query(() => {
    return "Hello Hono!";
  }),
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
