import { InteractionResponseType } from "discord-interactions";

import { connect, socialEvents } from "@knighthacks/db";

import { HonoContext } from "~/config";
import { isAdmin } from "../utils";

export async function createEvent(
  c: HonoContext,
  interaction: any,
  db: ReturnType<typeof connect>,
) {
  if (
    isAdmin(interaction.member.roles as string[], c.env.DISCORD_ADMIN_ROLE_ID)
  ) {
    return c.text("You are not an admin!", 403);
  }
  const socialEvent = interaction.data.options.reduce((socialEvent, item) => {
    socialEvent[item.name] = item.value;
    return socialEvent;
  }, {});
  await db.insert(socialEvents).values(socialEvent);
  return c.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Created new event ${socialEvent.name} on ${socialEvent.date} at ${socialEvent.location} worth ${socialEvent.points} points!`,
    },
  });
}
