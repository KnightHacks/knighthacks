import { asc, hackathons } from "@knighthacks/db";

import { router } from "../init";
import { publicProcedure } from "../procedures";

export const hackathonsRouter = router({
  getCurrentHackathon: publicProcedure.query(async ({ ctx }) => {
    // Get hackathon with the closest start date
    const hackathon = await ctx.db.query.hackathons.findFirst({
      orderBy: [asc(hackathons.startDate)],
    });

    return hackathon ?? null;
  }),
});
