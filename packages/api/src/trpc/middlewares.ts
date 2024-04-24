import { TRPCError } from "@trpc/server";

import {
  and,
  asc,
  eq,
  hackathons,
  hackers,
  userProfiles,
} from "@knighthacks/db";

import { middleware } from "./init";

export const isAuthenticated = middleware((opts) => {
  const user = opts.ctx.user;

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: {
        ...user,
        isAdmin: user.email.endsWith("@knighthacks.org"),
      },
    },
  });
});

export const isAdmin = isAuthenticated.unstable_pipe((opts) => {
  if (!opts.ctx.user.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not an admin" });
  }

  return opts.next(opts);
});

export const hasProfile = isAuthenticated.unstable_pipe(async (opts) => {
  const profile = await opts.ctx.db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, opts.ctx.user.id),
  });

  if (!profile) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No profile found",
    });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: {
        ...opts.ctx.user,
        profile,
      },
    },
  });
});

export const hasApplied = hasProfile.unstable_pipe(async (opts) => {
  const user = opts.ctx.user;
  const hackathon = await opts.ctx.db.query.hackathons.findFirst({
    orderBy: asc(hackathons.startDate),
  });

  if (!hackathon) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No hackathons found",
    });
  }

  const hacker = await opts.ctx.db.query.hackers.findFirst({
    where: and(
      eq(hackers.userId, user.id),
      eq(hackers.hackathonId, hackathon.id),
    ),
  });

  if (!hacker) {
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
        hacker,
      },
      currentHackathon: hackathon,
    },
  });
});
