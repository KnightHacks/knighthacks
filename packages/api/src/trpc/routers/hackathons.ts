import { asc, hackathons, insertHackathonSchema } from "@knighthacks/db";

import { router } from "../init";
import { authenticatedProcedure, publicProcedure } from "../procedures";

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

  // updateHackathon: authenticatedProcedure.input(insertHackathonSchema).mutation(async ({ctx, input}) => {

  // })
});
