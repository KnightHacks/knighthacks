import { hackers, insertHackerSchema } from "@knighthacks/db";

import { router } from "../init";
import { authenticatedProcedure } from "../procedures";

export const hackersRouter = router({
  register: authenticatedProcedure
    .input(insertHackerSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.insert(hackers).values(input);
    }),
});
