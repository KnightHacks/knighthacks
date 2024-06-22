import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getAuth } from "@hono/clerk-auth";

import type { HonoContext } from "../config";

export function createTRPCContextFromHonoContext(c: HonoContext) {
  return async (opts: FetchCreateContextFnOptions) => {
    /*
     * Here we spawn a new database connection for each request.
     * This is because we can't share a connection between requests in a Cloudflare Worker.
     */
    const db = c.get("db");
    const auth = getAuth(c);
    const clerk = c.get("clerk");
    const user = auth?.sessionClaims
      ? await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, auth.sessionClaims.email),
        })
      : undefined;

    return {
      ...opts,
      db,
      clerk,
      user,
      clerkUser: auth?.sessionClaims,
      env: c.env,
    };
  };
}

export type TRPCContext = inferAsyncReturnType<
  ReturnType<typeof createTRPCContextFromHonoContext>
>;
