import { TRPCError } from "@trpc/server";

import { eq, users } from "@knighthacks/db";

import { middleware } from "./init";

export const isAuthenticated = middleware((opts) => {
  const user = opts.ctx.user;

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user,
    },
  });
});

export const isAdmin = isAuthenticated.unstable_pipe((opts) => {
  const user = opts.ctx.user;
  const email = user.email;

  // If email doesn't end with @knighthacks.org, then user is not an admin
  if (!email.endsWith("@knighthacks.org")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not an admin" });
  }

  return opts.next(opts);
});

export const hasProfile = isAuthenticated.unstable_pipe(async (opts) => {
  const user = await opts.ctx.db.query.users.findFirst({
    where: eq(users.email, opts.ctx.user.email),
    with: {
      profile: true,
    },
  });

  if (!user?.profile) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No KnightHack profile",
    });
  }

  return opts.next(opts);
});
