import { type inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { db as drizzle } from "db";

const db = drizzle;

export const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({
  db,
}); // 👈 Add your context here

export type Context = inferAsyncReturnType<typeof createContext>;
