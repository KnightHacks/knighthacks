import { asc, eq } from "@knighthacks/db";
import { hackathons } from "@knighthacks/db/schema";
import {
  CreateHackathonSchema,
  UpdateHackathonSchema,
} from "@knighthacks/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter } from "../init";
import { adminProcedure, publicProcedure } from "../procedures";

export const hackathonRouter = createTRPCRouter({
  current: publicProcedure.query(async ({ ctx }) => {
    const hackathon = await ctx.db.query.hackathons.findFirst({
      orderBy: [asc(hackathons.startDate)],
    });

    if (!hackathon)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No hackathons found",
      });

    return hackathon;
  }),
  adminCreate: adminProcedure
    .input(CreateHackathonSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(hackathons).values(input);
    }),
  adminAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackathons.findMany();
  }),
  adminDelete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(hackathons).where(eq(hackathons.id, input));
    }),
  adminUpdate: adminProcedure
    .input(UpdateHackathonSchema)
    .mutation(async ({ ctx, input: { hackathonID, ...hackathon } }) => {
      await ctx.db
        .update(hackathons)
        .set(hackathon)
        .where(eq(hackathons.id, hackathonID));
    }),
});
