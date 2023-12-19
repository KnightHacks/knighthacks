import { publicProcedure, router } from '../trpc';
import { usersRouter } from './users';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return 'Hello Hono!';
  }),
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
