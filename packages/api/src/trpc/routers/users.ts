import { z } from "zod";

import {
  asc,
  eq,
  hackathons,
  insertUserRequestSchema,
  users,
} from "@knighthacks/db";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const usersRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany();
  }),
  register: authenticatedProcedure
    .input(insertUserRequestSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(users).values({
        ...input,
        email: ctx.user.email,
        id: ctx.user.id,
      });
    }),
  getCurrentUser: authenticatedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.user.email),
      with: { hackers: true },
    });

    const currentHackathon = await ctx.db.query.hackathons.findFirst({
      orderBy: [asc(hackathons.startDate)],
    });

    if (!user) return null;
    if (!currentHackathon)
      return {
        ...user,
        hasAppliedToCurrentHackathon: false,
      };

    const hasAppliedToCurrentHackathon = user.hackers.some(
      (hacker) => hacker.hackathonId === currentHackathon.id,
    );

    return {
      ...user,
      hasAppliedToCurrentHackathon,
    };
  }),
  deleteUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [user] = await tx
          .select({ resume: users.resume })
          .from(users)
          .where(eq(users.id, input.id));

        if (!user) {
          tx.rollback();
          return;
        }

        // If deleting the user from Clerk fails, rollback the transaction
        try {
          await ctx.clerk.users.deleteUser(input.id);
        } catch {
          tx.rollback();
          return;
        }

        // Delete user's resume from Cloudflare R2
        if (user?.resume) {
          await ctx.env.KNIGHT_HACKS_BUCKET.delete(user.resume);
        }

        // Delete the user from the database
        await tx.delete(users).where(eq(users.id, input.id));
      });
    }),
});
