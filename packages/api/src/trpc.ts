import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "./context";
import { verify } from "hono/jwt";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;

const isAdmin = middleware(async (opts) => {
  const cookies = opts.ctx.req.headers.get("cookie");
  if (!cookies) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No cookie" });
  }

  const token = cookies.split(";").find((c) => c.startsWith("accessToken"));
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No token" });
  }

  const decoded = await verify(token, opts.ctx.bindings.JWT_SECRET);
  if (!decoded) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not admin" });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: decoded,
    },
  });
});

export const publicProcedure = t.procedure;
export const privateProcedure = publicProcedure.use(isAdmin);
