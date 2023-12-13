import { type inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Bindings } from "./app";
import { connect } from "db";

export function createContextWithBindings(bindings: Bindings) {
  const db = connect(bindings.DATABASE_URL);

  return (opts: FetchCreateContextFnOptions) => {
    return {
      ...opts,
      bindings,
      db,
    };
  };
}
export type Context = inferAsyncReturnType<typeof createContextWithBindings>;
