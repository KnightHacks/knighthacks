import { type inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Bindings } from "./app";
import { connect } from "db";

export function createContext(bindings: Bindings) {
  /*
    Here we have to create a new connection to the database for each request.
    This is because we're using a cloudflare worker, and the worker is stateles, meaning
    that we can't keep a persistent connection to the database.
   */
  const db = connect(bindings.DATABASE_URL);

  return (opts: FetchCreateContextFnOptions) => {
    return {
      ...opts,
      bindings,
      db,
    };
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
