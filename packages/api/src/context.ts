import { type inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Bindings } from "./app";
import { connect } from "db";
import { Context as HonoContext } from "hono";

export function createTRPCContextFromHonoContext(
  c: HonoContext<{ Bindings: Bindings }>
) {
  return async (opts: FetchCreateContextFnOptions) => {
    /*
     * Here we spawn a new database connection for each request.
     * This is because we can't share a connection between requests in a Cloudflare Worker.
     */
    const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
    const session = await c.get("jwtPayload");

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
