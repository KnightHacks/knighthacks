import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
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

const isAdmin = isAuthenticated.unstable_pipe((opts) => {
  const user = opts.ctx.user;
  const email = user.email;

  // If email doesn't end with @knighthacks.org, then it's not an admin
  if (!email.endsWith("@knighthacks.org")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not an admin" });
  }

  return opts.next(opts);
});

export const publicProcedure = t.procedure; // Public procedures don't require a token
export const adminProcedure = publicProcedure.use(isAdmin); // Admin procedures require a knighthacks.org email
export const authenticatedProcedure = publicProcedure.use(isAuthenticated); // Authenticated procedures require a valid token
