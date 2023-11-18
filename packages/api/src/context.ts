import { type inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

export const createContext =
  ({}: trpcExpress.CreateExpressContextOptions) => ({}); // 👈 Add your context here

export type Context = inferAsyncReturnType<typeof createContext>;
