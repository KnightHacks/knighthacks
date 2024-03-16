import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { asc, eq, hackathons, userProfiles, users } from "@knighthacks/db";
import {
  AddUserProfileSchema,
  AddUserSchema,
  UpdateUserProfileSchema,
  UpdateUserSchema,
} from "@knighthacks/validators";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const usersRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      with: { hackers: true, profile: true },
    });
  }),
  addProfile: authenticatedProcedure
    .input(AddUserProfileSchema)
    .mutation(({ ctx, input }) => {
      if (
        ctx.user.email !== input.userId &&
        !ctx.user.email.endsWith("@knighthacks.org")
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to add profile for other user",
        });
      }

      return ctx.db.insert(userProfiles).values(input);
    }),
  updateProfile: authenticatedProcedure
    .input(UpdateUserProfileSchema)
    .mutation(({ ctx, input }) => {
      if (
        ctx.user.email !== input.userId &&
        !ctx.user.email.endsWith("@knighthacks.org")
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to add profile for other user",
        });
      }

      return ctx.db
        .update(userProfiles)
        .set(input)
        .where(eq(userProfiles.userId, input.userId));
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
      await ctx.clerk.users.deleteUser(input);
      await db.delete(users).where(eq(users.id, input));
    });
  }),
  add: adminProcedure.input(AddUserSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.transaction(async (db) => {
      // Check if email is already in use
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is already in use",
        });
      }

      const user = await ctx.clerk.users.createUser({
        firstName: input.firstName,
        lastName: input.lastName,
        emailAddress: [input.email],
      });

      await db.insert(users).values({ ...input, id: user.id });
    });
  }),
  update: adminProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        await ctx.clerk.users.updateUser(input.userId, {
          firstName: input.firstName,
          lastName: input.lastName,
          // TODO: Find a way to update email
        });
        await db.update(users).set(input).where(eq(users.id, input.userId));
      });
    }),
  getById: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, input),
      with: { hackers: true, profile: true },
    });
  }),
});
