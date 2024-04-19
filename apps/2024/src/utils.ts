import { cache } from "react";
import { auth } from "@clerk/nextjs";

import { db, eq, users } from "@knighthacks/db";

export const getCurrentUser = cache(async () => {
  const { sessionClaims } = auth();

  if (!sessionClaims?.email) {
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
