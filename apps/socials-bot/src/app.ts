/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// I hate Discord's typings

import type { Next } from "hono";
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { Hono } from "hono";

import { connect, socialEvents } from "@knighthacks/db";

import type { HonoConfig, HonoContext } from "../config";

async function verifyDiscordRequest(c: HonoContext, next: Next) {
  const signature = c.req.header("x-signature-ed25519");
  const timestamp = c.req.header("x-signature-timestamp");

  const text = await c.req.text();

  console.log(text);

  const isValidRequest =
    signature &&
    timestamp &&
    verifyKey(text, signature, timestamp, c.env.DISCORD_PUBLIC_KEY);

  if (!isValidRequest) {
    return c.text("Invalid request signature", 401);
  }

  c.set("interaction", JSON.parse(text));

  return next();
}

function isAdmin(roles: string[], adminRoleId: string) {
  return roles.includes(adminRoleId);
}

const app = new Hono<HonoConfig>().post(
  "/",
  verifyDiscordRequest,
  async (c) => {
    const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
    const interaction = c.get("interaction");

    if (interaction.type === InteractionType.PING) {
      return c.json({
        type: InteractionResponseType.PONG,
      });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const command = interaction.data;
      switch (command.name) {
        case "ping": {
          return c.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "pong!",
            },
          });
        }
        case "createevent": {
          if (
            isAdmin(
              interaction.member.roles as string[],
              c.env.DISCORD_ADMIN_ROLE_ID,
            )
          ) {
            return c.text("You are not an admin!", 403);
          }
          const socialEvent = command.options.reduce((socialEvent, item) => {
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
        case "signin": {
          return;
        }
        default:
          return c.text("Unknown command", 400);
      }
    }

    return c.text("Unknown interaction type", 400);
  },
);

export { app };
