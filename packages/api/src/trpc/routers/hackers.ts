import { z } from "zod";

import { asc, eq, hackathons, hackers } from "@knighthacks/db";
import {
  CreateHackerSchema,
  UpdateHackerSchema,
} from "@knighthacks/validators";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const hackerRouter = router({
  register: authenticatedProcedure
    .input(CreateHackerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const hackathon = await tx.query.hackathons.findFirst({
          orderBy: [asc(hackathons.startDate)],
        });

        if (!hackathon) {
          tx.rollback();
          return;
        }

        await tx.insert(hackers).values({
          ...input,
          hackathonId: hackathon.id,
          userId: ctx.user.id,
        });
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
  allHackathons: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackers.findMany({
      where: eq(hackers.userId, ctx.user.id),
      with: {
        hackathon: true,
      },
    });
  }),
  status: authenticatedProcedure.query(async ({ ctx }) => {
    return await ctx.db.transaction(async (tx) => {
      const hackathon = await tx.query.hackathons.findFirst({
        orderBy: [asc(hackathons.startDate)],
      });

      if (!hackathon) {
        tx.rollback();
        return;
      }

      const hacker = await tx.query.hackers.findFirst({
        where: eq(hackers.userId, ctx.user.id),
      });

      if (!hacker) {
        tx.rollback();
        return;
      }

      return hacker.status;
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
