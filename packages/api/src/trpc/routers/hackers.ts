import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { asc, eq, hackathons, hackers } from "@knighthacks/db";
import {
  ApplyToHackathonSchema,
  CreateHackerSchema,
  UpdateHackerSchema,
} from "@knighthacks/validators";

import { createTRPCRouter } from "../init";
import {
  adminProcedure,
  applicationProcedure,
  profileProcedure,
} from "../procedures";

export const hackerRouter = createTRPCRouter({
  apply: profileProcedure
    .input(ApplyToHackathonSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        const currentHackathon = await db.query.hackathons.findFirst({
          orderBy: asc(hackathons.startDate),
        });

        if (!currentHackathon)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No hackathons found",
          });

        await db.insert(hackers).values({
          ...input,
          userId: ctx.user.id,
          hackathonId: currentHackathon.id,
        });
      });
    }),
  application: applicationProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackers.findFirst({
      where: eq(hackers.userId, ctx.user.id),
      with: {
        user: {
          with: {
            profile: true,
          },
        },
      },
    });
  }),
  adminAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackers.findMany({
      with: {
        hackathon: true,
        user: true,
      },
    });
  }),
  adminUpdate: adminProcedure
    .input(UpdateHackerSchema)
    .mutation(async ({ ctx, input: { hackerId, ...hacker } }) => {
      await ctx.db.update(hackers).set(hacker).where(eq(hackers.id, hackerId));
    }),
  adminDelete: adminProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(hackers).where(eq(hackers.id, input));
    }),
  adminCreate: adminProcedure
    .input(CreateHackerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(hackers).values(input);
    }),
});
