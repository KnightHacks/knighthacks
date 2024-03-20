import { z } from "zod";

import { eq, sponsors } from "@knighthacks/db";
import {
  CreateSponsorSchema,
  UpdateSponsorSchema,
} from "@knighthacks/validators";

import { router } from "../init";
import { adminProcedure } from "../procedures";

export const sponsorRouter = router({
  create: adminProcedure
    .input(CreateSponsorSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(sponsors).values(input);
    }),
  all: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.sponsors.findMany();
  }),
  update: adminProcedure
    .input(UpdateSponsorSchema)
    .mutation(async ({ ctx, input: { sponsorId, ...sponsor } }) => {
      await ctx.db
        .update(sponsors)
        .set(sponsor)
        .where(eq(sponsors.id, sponsorId));
    }),
  delete: adminProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(sponsors).where(eq(sponsors.id, input));
  }),
});
