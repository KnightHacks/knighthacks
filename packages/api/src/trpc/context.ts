import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getAuth } from "@hono/clerk-auth";

import type { HonoContext } from "../config";

export async function createContext(
  opts: FetchCreateContextFnOptions,
  c: HonoContext,
) {
  const db = c.get("db");
  const auth = getAuth(c);
  const clerk = c.get("clerk");
  const clerkUser = auth?.sessionClaims;
  const user = clerkUser?.id
    ? await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkID, clerkUser.id),
        with: { profile: true, hackers: true },
      })
    : undefined;
  return {
    ...opts,
    db,
    clerk,
    clerkUser,
    user,
  };
}
export type TRPCContext = Awaited<ReturnType<typeof createContext>>;
