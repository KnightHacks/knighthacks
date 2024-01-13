import type { Next } from "hono";
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { Hono } from "hono";

import type { HonoConfig, HonoContext, Interaction } from "../config";
import type { Command } from "./commands";

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

  c.set("interaction", JSON.parse(text) as Interaction);

  return next();
}

const app = new Hono<HonoConfig>().post("/", verifyDiscordRequest, (c) => {
  const interaction = c.get("interaction");

  if (interaction.type === InteractionType.PING) {
    return c.json({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const command = interaction.data.name as Command["name"];
    switch (command) {
      case "ping":
        return c.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "pong!",
          },
        });
      default:
        return c.text("Unknown command", 400);
    }
  }

  return c.text("Unknown interaction type", 400);
});

export { app };
