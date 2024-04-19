import { cache } from "react";
import { auth } from "@clerk/nextjs";

import { connect, eq, users } from "@knighthacks/db";

export const db = connect(
  process.env.DATABASE_URL!,
  process.env.DATABASE_AUTH_TOKEN,
);

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

export const HACKATHON_ID = 1;
