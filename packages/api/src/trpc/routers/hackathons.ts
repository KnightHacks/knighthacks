import { z } from "zod";

import { asc, eq, hackathons, insertHackathonSchema } from "@knighthacks/db";
import { CreateHackathonSchema } from "@knighthacks/validators";

import { router } from "../init";
import { adminProcedure, publicProcedure } from "../procedures";

export const hackathonRouter = router({
  current: publicProcedure.query(async ({ ctx }) => {
    // Get hackathon with the closest start date
    const hackathon = await ctx.db.query.hackathons.findFirst({
      orderBy: [asc(hackathons.startDate)],
    });
    return hackathon ?? null;
  }),
  create: adminProcedure
    .input(CreateHackathonSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(hackathons).values(input);
    }),
  all: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackathons.findMany();
  }),
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.db.delete(hackathons).where(eq(hackathons.name, input));
  }),
  update: adminProcedure
    .input(insertHackathonSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(hackathons)
        .set(input)
        .where(eq(hackathons.id, Number(input.id)));
    }),
});
