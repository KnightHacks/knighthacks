import { z } from "zod";

import {
  asc,
  eq,
  hackathons,
  insertUserProfileSchema,
  insertUserSchema,
  userProfiles,
  users,
} from "@knighthacks/db";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const usersRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      with: { hackers: true, profile: true },
    });
  }),
  addProfile: authenticatedProcedure
    .input(insertUserProfileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(userProfiles).values({
        ...input,
        userId: ctx.user.id,
      });
    }),
  updateProfile: authenticatedProcedure
    .input(insertUserProfileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(userProfiles)
        .set(input)
        .where(eq(userProfiles.userId, ctx.user.id));
    }),
  getCurrent: authenticatedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.user.email),
      with: { hackers: true, profile: true },
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
  add: adminProcedure
    .input(insertUserSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        // Create user in Clerk
        const user = await ctx.clerk.users.createUser({
          firstName: input.firstName,
          lastName: input.lastName,
          emailAddress: [input.email],
        });
        await db.insert(users).values({ ...input, id: user.id }); // Create user in database
      });
    }),
  update: adminProcedure
    .input(insertUserSchema.partial().extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        // Update user in Clerk
        await ctx.clerk.users.updateUser(input.id, {
          firstName: input.firstName,
          lastName: input.lastName,
          // TOOD: Find a way to update email
        });
        await db.update(users).set(input).where(eq(users.id, input.id)); // Update user in database
      });
    }),
  getById: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, input),
      with: { hackers: true, profile: true },
    });
  }),
  
});
