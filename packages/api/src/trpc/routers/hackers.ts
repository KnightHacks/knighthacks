import { z } from "zod";

import {
  asc,
  eq,
  hackathons,
  hackers,
  insertHackerRequestSchema,
} from "@knighthacks/db";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const hackersRouter = router({
  register: authenticatedProcedure
    .input(insertHackerRequestSchema)
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
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackers.findMany({
      with: {
        hackathon: true,
      },
    });
  }),
  getMyHackathons: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.hackers.findMany({
      where: eq(hackers.userId, ctx.user.id),
      with: {
        hackathon: true,
      },
    });
  }),
  getMyStatus: authenticatedProcedure.query(async ({ ctx }) => {
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
  update: authenticatedProcedure
    .input(insertHackerRequestSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const hackathon = await tx.query.hackathons.findFirst({
          orderBy: [asc(hackathons.startDate)],
        });

        if (!hackathon) {
          tx.rollback();
          return;
        }

        await tx
          .update(hackers)
          .set(input)
          .where(eq(hackers.userId, ctx.user.id));
      });
    }),
  delete: authenticatedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(hackers).where(eq(hackers.userId, input));
    }),
});
