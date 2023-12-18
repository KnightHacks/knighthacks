import { eq, insertUserSchema, users } from "@knighthacks/db";
import { TRPCError } from "@trpc/server";
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = ctx.session.email;
      const oauthProvider = ctx.session.app_metadata.provider;
      const oauthUserId = ctx.session.sub;

      // If the user already exists, throw an error
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, ctx.session.email),
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
      where: eq(users.email, ctx.session.email),
    });
  }),
});
