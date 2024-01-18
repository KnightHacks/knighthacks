import { connect } from "@knighthacks/db";

export async function checkLeaderboard(db: ReturnType<typeof connect>) {
  // TODO: find a more efficient way get attendees sorted by points

  // Get all attendees
  const attendees = await db.query.attendees.findMany({
    with: {
      attendeesEvents: {
        with: {
          events: true,
        },
      },
    },
  });

  if (!attendees.length) {
    throw new Error("No attendees found!");
  }

  const attendeesWithPoints = attendees.map((attendee) => {
    const points = attendee.attendeesEvents.reduce((acc, curr) => {
      return acc + curr.events.points;
    }, 0);

    return {
      ...attendee,
      points,
    };
  });

  // Sort attendees by points and get top 10
  const sortedAttendees = attendeesWithPoints
    .sort((a, b) => {
      return b.points - a.points;
    })
    .slice(0, 10);

  return sortedAttendees;
}
