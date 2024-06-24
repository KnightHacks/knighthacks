import { TRPCError } from "@trpc/server";

import { middleware } from "./init";

export const isAuthenticated = middleware((opts) => {
  const clerkUser = opts.ctx.clerkUser;

  if (!clerkUser) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      isAdmin: clerkUser.email.endsWith("@knighthacks.org"),
      clerkUser,
    },
  });
});

export const isAdmin = isAuthenticated.unstable_pipe((opts) => {
  if (!opts.ctx.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not an admin" });
  }

  return opts.next(opts);
});

export const hasProfile = isAuthenticated.unstable_pipe(async (opts) => {
  if (!opts.ctx.user?.profile) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "User profile not found",
    });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user,
    },
  });
});

export const hasApplied = hasProfile.unstable_pipe(async (opts) => {
  const user = opts.ctx.user;
  const hackathon = await opts.ctx.db.query.hackathons.findFirst({
    orderBy: (hackathons, { asc }) => asc(hackathons.startDate),
  });

  if (!hackathon) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No hackathons found",
    });
  }

  const application = user.hackers.find(
    (hacker) => hacker.hackathonID === hackathon.id,
  );

  if (!application) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No application found",
    });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: {
        ...user,
        application,
      },
      currentHackathon: hackathon,
    },
  });
});
