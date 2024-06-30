import { mergeRouters } from "@trpc/server/unstable-core-do-not-import";

import { hackathonRouter } from "./hackathons";
import { hackerRouter } from "./hackers";
import { sponsorRouter } from "./sponsors";
import { userRouter } from "./users";

export const router = mergeRouters(
  userRouter,
  hackathonRouter,
  hackerRouter,
  sponsorRouter,
);

export type AppRouter = typeof router;
