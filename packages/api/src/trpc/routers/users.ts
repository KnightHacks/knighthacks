import { eq } from "@knighthacks/db";
import { userProfiles, users } from "@knighthacks/db/schema";
import {
  CreateUserProfileSchema,
  CreateUserSchema,
  ProfileApplicationSchema,
  UpdateUserProfileSchema,
  UpdateUserSchema,
} from "@knighthacks/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter } from "../init";
import {
  adminProcedure,
  authenticatedProcedure,
  profileProcedure,
} from "../procedures";

export const userRouter = createTRPCRouter({
  getUser: authenticatedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  getProfile: authenticatedProcedure.query(({ ctx }) => {
    return ctx.user?.profile;
  }),
  updateProfileApplication: profileProcedure
    .input(UpdateUserProfileSchema)
    .mutation(({ ctx, input: { userID, ...userProfile } }) => {
      return ctx.db
        .update(userProfiles)
        .set(userProfile)
        .where(eq(userProfiles.userID, userID));
    }),
  profileApplication: authenticatedProcedure
    .input(ProfileApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        const userID = (
          await db
            .insert(users)
            .values({
              clerkID: ctx.clerkUser.id,
              email: input.email,
              firstName: input.firstName,
              lastName: input.lastName,
            })
            .returning({
              id: users.id,
            })
        )[0]?.id;

        if (!userID) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });
        }

        await db.insert(userProfiles).values({
          ...input,
          userID,
          gender: input.gender,
        });
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
    .mutation(({ ctx, input: { userID, ...userProfile } }) => {
      return ctx.db
        .update(userProfiles)
        .set(userProfile)
        .where(eq(userProfiles.userID, userID));
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
    .mutation(async ({ ctx, input: { userID, ...user } }) => {
      await ctx.db.update(users).set(user).where(eq(users.id, userID));
    }),
});
