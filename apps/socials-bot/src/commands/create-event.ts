import { connect, events } from "@knighthacks/db";

import { Permission } from "~/utils";

export async function createEvent(
  interaction: any,
  db: ReturnType<typeof connect>,
  permissions: Permission[],
) {
  if (!permissions.includes("officer") && !permissions.includes("dev-lead"))
    throw new Error("You must be an officer to create an event");

  // Build event object from interaction options
  const event = interaction.data.options.reduce((event, option) => {
    event[option.name] = option.value;
    return event;
  }, {});

  // Validate event date follows YYYY-MM-DD format
  if (!event.date.match(/\d{4}-\d{2}-\d{2}/))
    throw new Error("Invalid date format");

  const insertedEvent = (await db.insert(events).values(event).returning())[0];

  if (!insertedEvent) {
    throw new Error("Failed to insert event");
  }

  return insertedEvent;
}
