import {
  asc,
  hackathons,
  hackers,
  insertHackerRequestSchema,
} from "@knighthacks/db";

import { router } from "../init";
import { authenticatedProcedure } from "../procedures";

export const hackersRouter = router({
  register: authenticatedProcedure
    .input(insertHackerRequestSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const hackathon = await tx.query.hackathons.findFirst({
          orderBy: [asc(hackathons.startDate)],
        });

        if (!hackathon) {
          tx.rollback();
          return;
        }

        await tx.insert(hackers).values({
          ...input,
          hackathonId: hackathon.id,
          userId: ctx.user.id,
        });
      });
    }),
});
