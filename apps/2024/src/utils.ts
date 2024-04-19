import { cache } from "react";
import { auth } from "@clerk/nextjs";

import { eq, users } from "@knighthacks/db";

import { db } from "./db";

export const getCurrentUser = cache(async () => {
  const { sessionClaims } = auth();

  if (!sessionClaims) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, sessionClaims.email),
    with: {
      hackers: true,
      profile: true,
    },
  });

  return user;
});
