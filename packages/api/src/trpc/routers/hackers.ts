import type { TRPCRouterRecord } from "@trpc/server";
import { asc, eq } from "@knighthacks/db";
import { hackathons, hackers } from "@knighthacks/db/schema";
import {
  CreateHackerSchema,
  HackerApplicationSchema,
  UpdateHackerApplicationSchema,
  UpdateHackerSchema,
} from "@knighthacks/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, profileProcedure } from "../procedures";

export const hackerRouter = {
  application: profileProcedure
    .input(HackerApplicationSchema)
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
          userID: ctx.user.id,
          hackathonID: currentHackathon.id,
          agreesToReceiveEmailsFromMLH: input.agreesToReceiveEmailsFromMLH,
        });
      });
    }),
  updateApplication: profileProcedure
    .input(UpdateHackerApplicationSchema)
    .mutation(async ({ ctx, input: { hackerID, ...application } }) => {
      await ctx.db
        .update(hackers)
        .set(application)
        .where(eq(hackers.id, hackerID));
    }),
  getApplication: profileProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackers.findFirst({
      where: eq(hackers.userID, ctx.user.id),
      with: {
        user: {
          with: {
            profile: true,
          },
        },
      },
    });
  }),
  userUpdate: profileProcedure
    .input(UpdateHackerSchema)
    .mutation(async ({ ctx, input: { hackerID, ...hacker } }) => {
      await ctx.db.update(hackers).set(hacker).where(eq(hackers.id, hackerID));
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
    .mutation(async ({ ctx, input: { hackerID, ...hacker } }) => {
      await ctx.db.update(hackers).set(hacker).where(eq(hackers.id, hackerID));
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
  getConfirmedHackerCount: profileProcedure.query(async ({ ctx }) => {
    const hackers = await ctx.db.query.hackers.findMany({
      with: {
        hackathon: true,
        user: true,
      },
    });
    let confirmedHackerCount = 0;
    for (const hacker of hackers) {
      if (hacker.status === "confirmed") {
        confirmedHackerCount += 1;
      }
    }
    return confirmedHackerCount;
  }),
} satisfies TRPCRouterRecord;
