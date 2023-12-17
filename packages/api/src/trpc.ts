import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "./context";
import { verify } from "hono/jwt";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const token = opts.ctx.req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No token" });
  }

  const decoded = await verify(token, opts.ctx.bindings.SUPABASE_JWT_SECRET);
  if (!decoded) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: decoded,
    },
  });
});

const isAdmin = isAuthenticated.unstable_pipe((opts) => {
  // Extract email from isAuthenticated middleware
  const email = opts.ctx.user.email;

  // If email doesn't end with @knighthacks.org, then it's not an admin
  if (!email.endsWith("@knighthacks.org")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not an admin" });
  }

  return opts.next(opts);
});

export const publicProcedure = t.procedure; // Public procedures don't require a token
export const adminProcedure = publicProcedure.use(isAdmin); // Admin procedures require knighthacks.org email
export const authenticatedProcedure = publicProcedure.use(isAuthenticated); // Authenticated procedures require a valid token
