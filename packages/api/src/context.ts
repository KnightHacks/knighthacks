import { type inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { PrismaClient } from "db";

const prisma = new PrismaClient();

export const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({
  prisma,
}); // 👈 Add your context here

export type Context = inferAsyncReturnType<typeof createContext>;
