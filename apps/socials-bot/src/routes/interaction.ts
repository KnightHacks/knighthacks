import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Hono } from "hono";

import { connect } from "@knighthacks/db";

import { signIn } from "~/commands/sign-in";
import { HonoConfig } from "~/config";
import { verifyDiscordRequest } from "~/middlewares/verify-discord-request";

export const interaction = new Hono<HonoConfig>().post(
  "/",
  verifyDiscordRequest,
  async (c) => {
    const interaction = c.get("interaction");

    if (interaction.type === InteractionType.PING) {
      return c.json({
        type: InteractionResponseType.PONG,
      });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      let commandName = interaction.data.name;
      switch (commandName) {
        case "ping": {
          return c.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "pong!",
            },
          });
        }
        case "createevent": {
        }
        case "signin": {
          const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
          await signIn(c, interaction, db);
          return c.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "Signed you in!",
            },
          });
        }
        default:
          return c.text("Unknown command", 400);
      }
    }

    return c.text("Unknown interaction type", 400);
  },
);
