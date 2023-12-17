import { type inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Bindings } from "./app";
import { connect } from "db";
import { verify } from "hono/jwt";

export function createContext(bindings: Bindings) {
  /*
    Here we have to create a new connection to the database for each request.
    This is because we're using a cloudflare worker, and the worker is stateles, meaning
    that we can't keep a persistent connection to the database.
   */

  return async (opts: FetchCreateContextFnOptions) => {
    const db = connect(bindings.TURSO_URL, bindings.TURSO_AUTH_TOKEN);
    const token = opts.req.headers.get("authorization")?.split(" ")[1];
    const session = await getSession(token, bindings.SUPABASE_JWT_SECRET);

    return {
      ...opts,
      bindings,
      db,
      session,
    };
  };
}

async function getSession(token: string | undefined, jwtSecret: string) {
  if (!token) {
    return null;
  }

  const decoded = await verify(token, jwtSecret);
  if (!decoded) {
    return null;
  }

  return decoded;
}
export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;
