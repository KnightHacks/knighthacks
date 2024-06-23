import { eq } from "@knighthacks/db";
import { sponsors } from "@knighthacks/db/schema";
import {
  CreateSponsorSchema,
  UpdateSponsorSchema,
} from "@knighthacks/validators";
import { z } from "zod";

import { createTRPCRouter } from "../init";
import { adminProcedure, publicProcedure } from "../procedures";

export const sponsorRouter = createTRPCRouter({
  adminCreate: adminProcedure
    .input(CreateSponsorSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(sponsors).values(input);
    }),
  userAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.sponsors.findMany();
  }),
  adminUpdate: adminProcedure
    .input(UpdateSponsorSchema)
    .mutation(async ({ ctx, input: { sponsorId, ...sponsor } }) => {
      await ctx.db
        .update(sponsors)
        .set(sponsor)
        .where(eq(sponsors.id, sponsorId));
    }),
  adminDelete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(sponsors).where(eq(sponsors.id, input));
    }),
});
