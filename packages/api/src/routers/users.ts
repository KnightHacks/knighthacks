import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, insertUserSchema, users } from "@knighthacks/db";

import { adminProcedure, authenticatedProcedure, router } from "../trpc";

export const usersRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany();
  }),
  register: authenticatedProcedure
    .input(
      insertUserSchema.omit({
        email: true,
        oauthProvider: true,
        oauthUserId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user.email!;
      const oauthProvider = ctx.user.app_metadata.provider as
        | "github"
        | "google";
      const oauthUserId = ctx.user.id;

      // If the user already exists, throw an error
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      return ctx.db.insert(users).values({
        ...input,
        email,
        oauthProvider,
        oauthUserId,
      });
    }),
  getCurrentUser: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.user.email!),
    });
  }),
  deleteUser: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.id, input.id));
    }),
});
