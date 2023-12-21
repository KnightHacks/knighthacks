import { TRPCError } from "@trpc/server";

import { middleware } from "./init";

export const isAuthenticated = middleware(async (opts) => {
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
