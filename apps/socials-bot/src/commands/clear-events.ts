import { connect, events } from "@knighthacks/db";

import { Permission } from "~/utils";

export async function clearEvents(
  db: ReturnType<typeof connect>,
  permissions: Permission[],
) {
  // if (
  //   !permissions.includes("president") ||
  //   !permissions.includes("vice-president")
  // )
  //   throw new Error(
  //     "You must be the president or vice president to clear events",
  //   );

  return await db.delete(events);
}
