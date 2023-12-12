import { t } from "../trpc";

export const appRouter = t.router({
  hello: t.procedure.query(() => {
    return "Hello Express!";
  }),
});

export type AppRouter = typeof appRouter;
