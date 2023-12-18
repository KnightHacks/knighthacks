import { insertUserSchema, users } from "db";
import {
  adminProcedure,
  publicProcedure,
  authenticatedProcedure,
  router,
} from "../trpc";
import { eq } from "db";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany();
  }),
  register: publicProcedure
    .input(insertUserSchema)
    .mutation(async ({ ctx, input }) => {
      // If the user already exists, throw an error
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }
      return await ctx.db.insert(users).values(input);
    }),

  getCurrentUser: authenticatedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.query.users.findFirst({
      where: eq(users.email, ctx.session.email),
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  }),
});
