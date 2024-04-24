import { z } from "zod";

import { eq, hackers } from "@knighthacks/db";
import {
  ApplyToHackathonSchema,
  CreateHackerSchema,
  UpdateHackerSchema,
} from "@knighthacks/validators";

import { createTRPCRouter } from "../init";
import { adminProcedure, applicationProcedure } from "../procedures";

export const hackerRouter = createTRPCRouter({
  apply: applicationProcedure
    .input(ApplyToHackathonSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.hacker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already applied",
        });

      await ctx.db.insert(hackers).values({
        ...input,
        hackathonId: ctx.currentHackathon.id,
        userId: ctx.user.id,
      });
    }),
  getApplication: applicationProcedure.query(async ({ ctx }) => {
    if (!ctx.user.hacker)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No application found",
      });

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
  all: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackers.findMany({
      with: {
        hackathon: true,
        user: true,
      },
    });
  }),
  allHackers: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackers.findMany({
      where: eq(hackers.userId, ctx.user.id),
      with: {
        hackathon: true,
      },
    });
  }),

  update: adminProcedure
    .input(UpdateHackerSchema)
    .mutation(async ({ ctx, input: { hackerId, ...hacker } }) => {
      await ctx.db.update(hackers).set(hacker).where(eq(hackers.id, hackerId));
    }),
  delete: adminProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(hackers).where(eq(hackers.id, input));
  }),
  create: adminProcedure
    .input(CreateHackerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(hackers).values(input);
    }),
});
