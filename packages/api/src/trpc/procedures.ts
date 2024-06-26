import { TRPCError } from "@trpc/server";

import { t } from "./init";

// Public procedures don't require a token
export const publicProcedure = t.procedure;

// Authenticated procedures require a valid token
export const authenticatedProcedure = publicProcedure.use(({ ctx, next }) => {
  const clerkUser = ctx.clerkUser;
  if (!clerkUser) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      clerkUser,
    },
  });
});

// Admin procedures require a user witth a knighthacks.org email
export const adminProcedure = authenticatedProcedure.use(({ ctx, next }) => {
  if (!ctx.clerkUser.email.endsWith("@knighthacks.org")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not an admin" });
  }
  return next();
});

// Profile procedures require a user with a profile
export const profileProcedure = authenticatedProcedure.use(
  async ({ ctx, next }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkID, ctx.clerkUser.id),
      with: { profile: true, hackers: true },
    });
    if (!user?.profile) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User profile not found",
      });
    }

    return next({
      ctx: {
        user,
      },
    });
  },
);
