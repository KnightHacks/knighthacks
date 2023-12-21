import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, insertUserRequestSchema, users } from "@knighthacks/db";

import { router } from "../init";
import { adminProcedure, authenticatedProcedure } from "../procedures";

export const usersRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany();
  }),
  register: authenticatedProcedure
    .input(insertUserRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const email = ctx.user.email;
      const clerkUserId = ctx.user.id;

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
        clerkUserId,
        email,
      });
    }),
  getCurrentUser: authenticatedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.user.email),
    });

    return user ?? null;
  }),
  deleteUser: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.id, input.id));
    }),
});
