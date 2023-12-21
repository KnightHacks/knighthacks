import type { Next } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";

import type { HonoContext } from "../config";

export function clerk(c: HonoContext, next: Next) {
  return clerkMiddleware({
    publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
    secretKey: c.env.CLERK_SECRET_KEY,
  })(c, next);
}
