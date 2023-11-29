import { type inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { db } from "db";

export const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({
  db,
});

export type Context = inferAsyncReturnType<typeof createContext>;
