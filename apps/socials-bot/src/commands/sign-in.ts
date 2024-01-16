import {
  attendees,
  attendeesEvents,
  connect,
  eq,
  events,
} from "@knighthacks/db";

export async function signIn(interaction: any, db: ReturnType<typeof connect>) {
  const { id: discordId } = interaction.member.user;
  const secret = interaction.data.options[0].value;

  // Check if event exists
  let event = await db.query.events.findFirst({
    where: eq(events.secret, secret),
  });

  if (!event) {
    throw new Error("Event does not exist");
  }

  // Check if attendee exists
  let attendee = await db.query.attendees.findFirst({
    where: eq(attendees.discord, discordId),
    with: {
      attendeesEvents: {
        with: {
          events: true,
        },
      },
    },
    columns: {
      id: true,
    },
  });

  // Handle case where attendee does not exist
  if (!attendee) {
    let insertedAttendee = (
      await db
        .insert(attendees)
        .values({
          discord: discordId,
        })
        .returning({ id: attendees.id })
    )[0];
    if (!insertedAttendee) {
      throw new Error("Failed to insert attendee");
    }
    // Check in attendee to event
    await db.insert(attendeesEvents).values({
      attendeeId: insertedAttendee.id,
      eventId: event.id,
    });

    return;
  }

  // Check if they have already signed into this event
  if (
    attendee?.attendeesEvents.find(
      (attendeeEvent) => attendeeEvent.events.secret === secret,
    )
  ) {
    throw new Error("You have already signed into this event");
  }

  // Check in attendee to event
  await db.insert(attendeesEvents).values({
    attendeeId: attendee.id,
    eventId: event.id,
  });
}
