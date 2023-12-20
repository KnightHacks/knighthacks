import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { connect } from "@knighthacks/db";

import type { HonoContext } from "./config";

export function createTRPCContextFromHonoContext(c: HonoContext) {
  return (opts: FetchCreateContextFnOptions) => {
    /*
     * Here we spawn a new database connection for each request.
     * This is because we can't share a connection between requests in a Cloudflare Worker.
     */
    const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
    const user = c.get("user");

    return {
      ...opts,
      db,
      user,
      env: c.env,
    };
  };
}

export type TRPCContext = inferAsyncReturnType<
  ReturnType<typeof createTRPCContextFromHonoContext>
>;
