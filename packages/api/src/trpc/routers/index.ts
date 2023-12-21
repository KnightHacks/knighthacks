import { router } from "../init";
import { publicProcedure } from "../procedures";
import { hackathonsRouter } from "./hackathons";
import { usersRouter } from "./users";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "Hello Hono!";
  }),
  users: usersRouter,
  hackathons: hackathonsRouter,
});

export type AppRouter = typeof appRouter;
