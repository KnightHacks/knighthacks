import { z } from "zod";

import {
  asc,
  eq,
  hackathons,
  hackers,
  insertHackerFormSchema,
  insertHackerSchema,
} from "@knighthacks/db";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const hackerRouter = router({
  register: authenticatedProcedure
    .input(insertHackerFormSchema)
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
        user: true,
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
  update: adminProcedure
    .input(insertHackerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(hackers)
        .set(input)
        .where(eq(hackers.id, Number(input.id)));
    }),
  delete: adminProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(hackers).where(eq(hackers.id, input));
  }),
  add: adminProcedure
    .input(insertHackerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(hackers).values(input);
    }),
});
