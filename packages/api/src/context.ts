import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Context as HonoContext } from "hono";

import { connect } from "@knighthacks/db";

import type { Bindings } from "./app";

export function createTRPCContextFromHonoContext(
  c: HonoContext<{ Bindings: Bindings }>,
) {
  return async (opts: FetchCreateContextFnOptions) => {
    /*
     * Here we spawn a new database connection for each request.
     * This is because we can't share a connection between requests in a Cloudflare Worker.
     */
    const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
    const session = (await c.get("jwtPayload")) as Record<string, unknown>;

    return {
      ...opts,
      db,
      session,
      env: c.env,
    };
  };
}

export type TRPCContext = inferAsyncReturnType<
  ReturnType<typeof createTRPCContextFromHonoContext>
>;
