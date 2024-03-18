import { router } from "../init";
import { publicProcedure } from "../procedures";
import { hackathonRouter } from "./hackathons";
import { hackerRouter } from "./hackers";
import { sponsorRouter } from "./sponsors";
import { userRouter } from "./users";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "Hello from Hono!";
  }),
  user: userRouter,
  hackathon: hackathonRouter,
  hacker: hackerRouter,
  sponsor: sponsorRouter,
});

export type AppRouter = typeof appRouter;
