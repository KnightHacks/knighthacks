import type { Next } from "hono";

import { connect } from "@knighthacks/db";

import type { HonoContext } from "../config";

// Spawn a new database connection per request and attach it to the context.
export function db(c: HonoContext, next: Next) {
  const db = connect(c.env.DATABASE_URL, c.env.DATABASE_AUTH_TOKEN);
  c.set("db", db);
  return next();
}
