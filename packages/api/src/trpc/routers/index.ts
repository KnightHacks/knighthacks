import { createTRPCRouter } from "../init";
import { emailRouter } from "./email";
import { hackathonRouter } from "./hackathons";
import { hackerRouter } from "./hackers";
import { sponsorRouter } from "./sponsors";
import { userRouter } from "./users";

export const router = createTRPCRouter({
  user: userRouter,
  hackathon: hackathonRouter,
  hacker: hackerRouter,
  sponsor: sponsorRouter,
  email: emailRouter,
});

export type AppRouter = typeof router;
