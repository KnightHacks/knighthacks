import { z } from "zod";

import {
  asc,
  eq,
  hackathons,
  insertUserMetadataSchema,
  userMetadata,
  users,
} from "@knighthacks/db";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const usersRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      with: { hackers: true, metadata: true },
    });
  }),
  insertMetadata: authenticatedProcedure
    .input(insertUserMetadataSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(userMetadata).values({
        ...input,
        userId: ctx.user.id,
      });
    }),
  getCurrent: authenticatedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.user.email),
      with: { hackers: true, metadata: true },
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
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.db.transaction(async (db) => {
      await ctx.clerk.users.deleteUser(input); // Delete user from Clerk
      await db.delete(users).where(eq(users.id, input)); // Delete user from database
    });
  }),
});
