import { attendees, connect, eq } from "@knighthacks/db";

export async function checkPoints(
  interaction: any,
  db: ReturnType<typeof connect>,
) {
  const discordId = interaction.member.user.id;
  const attendee = await db.query.attendees.findFirst({
    where: eq(attendees.discord, discordId),
    with: {
      attendeesEvents: {
        with: {
          events: true,
        },
      },
    },
  });

  if (!attendee) {
    throw new Error("You are not signed up for any events");
  }

  // Sum up points from all events
  const points = attendee.attendeesEvents.reduce(
    (points, attendeeEvent) => points + attendeeEvent.events.points,
    0,
  );

  return points;
}
