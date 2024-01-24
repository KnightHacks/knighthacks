import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Hono } from "hono";

import { connect, events } from "@knighthacks/db";

import { Command } from "~/commands";
import { checkLeaderboard } from "~/commands/check-leaderboard";
import { checkPoints } from "~/commands/check-points";
import { clearEvents } from "~/commands/clear-events";
import { createEvent } from "~/commands/create-event";
import { signIn } from "~/commands/sign-in";
import { HonoConfig } from "~/config";
import { verifyDiscordRequest } from "~/middlewares/verify-discord-request";
import { getUserPermissions } from "~/utils";

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
      let commandName = interaction.data.name as Command["name"];
      switch (commandName) {
        case "ping":
          return c.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "Pong!",
              flags: 1 << 6,
            },
          });
        case "createevent": {
          try {
            const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
            const permissions = getUserPermissions(interaction.member.roles);
            const event = await createEvent(interaction, db, permissions);
            return c.json({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `Created new event ${event.name} on ${event.date} at ${event.location} worth ${event.points} points!`,
                flags: 1 << 6,
              },
            });
          } catch (error) {
            if (error instanceof Error) {
              return c.json({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: error.message,
                  flags: 1 << 6,
                },
              });
            }
          }
        }
        case "signin": {
          try {
            const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
            await signIn(interaction, db);
            return c.json({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: "Signed you in!",
                flags: 1 << 6,
              },
            });
          } catch (error) {
            if (error instanceof Error) {
              return c.json({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: error.message,
                  flags: 1 << 6,
                },
              });
            }
          }
        }
        case "checkpoints": {
          const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
          const points = await checkPoints(interaction, db);
          return c.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `You have ${points} points!`,
              flags: 1 << 6,
            },
          });
        }
        case "clearevents": {
          try {
            const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
            const permissions = getUserPermissions(interaction.member.roles);
            await clearEvents(db, permissions);
            return c.json({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: "Cleared all events!",
                flags: 1 << 6,
              },
            });
          } catch (error) {
            if (error instanceof Error) {
              return c.json({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: error.message,
                  flags: 1 << 6,
                },
              });
            }
          }
        }
        case "checkleaderboard": {
          try {
            const db = connect(c.env.TURSO_URL, c.env.TURSO_AUTH_TOKEN);
            const leaderboard = await checkLeaderboard(db);
            const leaderboardString = leaderboard
              .map(
                (attendee, index) =>
                  `${index + 1}. ${attendee.discordUsername} - ${
                    attendee.points
                  } points`,
              )
              .join("\n");

            return c.json({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `**Leaderboard**\n${leaderboardString}`,
                flags: 1 << 6,
              },
            });
          } catch (error) {
            if (error instanceof Error) {
              return c.json({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: error.message,
                  flags: 1 << 6,
                },
              });
            }
          }
        }
        default:
          return c.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "Unknown command",
              flags: 1 << 6,
            },
          });
      }
    }
  },
);
