import { asc, eq, hackathons, insertHackathonSchema } from "@knighthacks/db";

import { router } from "../init";
import { authenticatedProcedure, publicProcedure } from "../procedures";
import { z } from "zod";
import { db } from "../../middlewares";

export const hackathonsRouter = router({
  getCurrentHackathon: publicProcedure.query(async ({ ctx }) => {
    // Get hackathon with the closest start date
    const hackathon = await ctx.db.query.hackathons.findFirst({
      orderBy: [asc(hackathons.startDate)],
    });

    return hackathon ?? null;
  }),

  createHackathon: authenticatedProcedure.input(insertHackathonSchema.omit({id: true})).mutation(async ({ctx, input}) => {
    console.log("Create Hackathon Input: " + input)
    const newHackathon =  await ctx.db.insert(hackathons).values(input)

    return newHackathon ?? null;
  }),

  getAll: authenticatedProcedure.query(async ({ ctx }) => {
    const getHackathons = ctx.db.query.hackathons.findMany();

    return getHackathons ?? null
  }),

  deleteHackathon: authenticatedProcedure.input(z.string()).mutation(async ({ctx, input}) => {
    await ctx.db.transaction(async (db) => {
    return await db.delete(hackathons).where(eq(hackathons.name, input))
    })
  }),

  updateHackathon: authenticatedProcedure.input(insertHackathonSchema).mutation(async ({ctx, input}) => {
    await ctx.db.transaction(async (db) => {
      return await db.update(hackathons).set(input).where(eq(hackathons.name, input.name))
    })
  })
});
