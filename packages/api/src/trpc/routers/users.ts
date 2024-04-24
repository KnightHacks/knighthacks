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
  profile: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, ctx.user.id),
    });
  }),
  adminAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      with: { hackers: true, profile: true },
    });
  }),
  adminCreateProfile: adminProcedure
    .input(CreateUserProfileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(userProfiles).values(input);
    }),
  adminUpdateProfile: adminProcedure
    .input(UpdateUserProfileSchema)
    .mutation(({ ctx, input: { userId, ...userProfile } }) => {
      return ctx.db
        .update(userProfiles)
        .set(userProfile)
        .where(eq(userProfiles.userId, userId));
    }),
  adminDelete: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        await ctx.clerk.users.deleteUser(input);
        await db.delete(users).where(eq(users.id, input));
      });
    }),
  adminCreate: adminProcedure
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
  adminUpdate: adminProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input: { userId, ...user } }) => {
      await ctx.db.transaction(async (db) => {
        await ctx.clerk.users.updateUser(userId, user);
        await db.update(users).set(user).where(eq(users.id, userId));
      });
    }),
});
