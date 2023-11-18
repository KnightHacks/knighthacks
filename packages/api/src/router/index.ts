import { t } from "../trpc";
import { exampleRouter } from "./example";

export const appRouter = t.router({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;

