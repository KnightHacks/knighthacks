import { t } from "../trpc";

export const appRouter = t.router({
  hello: t.procedure.query(() => {
    return "Hello Hono!";
  }),
});

export type AppRouter = typeof appRouter;
