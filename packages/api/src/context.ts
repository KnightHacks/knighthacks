import { type inferAsyncReturnType } from "@trpc/server";
import { db } from "db";

export async function createContext() {
  return { db };
}

export type Context = inferAsyncReturnType<typeof createContext>;
