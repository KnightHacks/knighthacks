import { z } from "zod";

import { eq, userProfiles, users } from "@knighthacks/db";
import {
  CreateUserProfileSchema,
  CreateUserSchema,
  ProfileApplicationSchema,
  UpdateUserProfileSchema,
  UpdateUserSchema,
} from "@knighthacks/validators";

import { createTRPCRouter } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const userRouter = createTRPCRouter({
  getProfile: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, ctx.user.id),
    });
  }),
  profileApplication: authenticatedProcedure
    .input(ProfileApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(userProfiles).values({
        ...input,
        userId: ctx.user.id,
        gender: input.gender,
      });
    }),
  adminCreateProfile: adminProcedure
    .input(CreateUserProfileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(userProfiles).values(input);
    }),
  adminAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      with: { hackers: true, profile: true },
    });
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
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(users).where(eq(users.id, input));
    }),
  adminCreate: adminProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values(input);
    }),
  adminUpdate: adminProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input: { userId, ...user } }) => {
      await ctx.db.update(users).set(user).where(eq(users.id, userId));
    }),
});
