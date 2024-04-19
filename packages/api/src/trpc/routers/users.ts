import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, userProfiles, users } from "@knighthacks/db";
import {
  CreateUserProfileSchema,
  CreateUserSchema,
  UpdateUserProfileSchema,
  UpdateUserSchema,
} from "@knighthacks/validators";

import { createTRPCRouter } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const userRouter = createTRPCRouter({
  all: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      with: { hackers: true, profile: true },
    });
  }),
  createProfile: authenticatedProcedure
    .input(CreateUserProfileSchema)
    .mutation(({ ctx, input }) => {
      if (
        ctx.user.id !== input.userId &&
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
    .mutation(({ ctx, input: { userId, ...userProfile } }) => {
      if (
        ctx.user.id !== userId &&
        !ctx.user.email.endsWith("@knighthacks.org")
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to add profile for other user",
        });
      }

      return ctx.db
        .update(userProfiles)
        .set(userProfile)
        .where(eq(userProfiles.userId, userId));
    }),
  current: authenticatedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.user.email),
      with: {
        hackers: true,
        profile: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.db.transaction(async (db) => {
      await ctx.clerk.users.deleteUser(input);
      await db.delete(users).where(eq(users.id, input));
    });
  }),
  create: adminProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
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
    .mutation(async ({ ctx, input: { userId, ...user } }) => {
      await ctx.db.transaction(async (db) => {
        await ctx.clerk.users.updateUser(userId, user);
        await db.update(users).set(user).where(eq(users.id, userId));
      });
    }),
  byId: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, input),
      with: { hackers: true, profile: true },
    });
  }),
});
