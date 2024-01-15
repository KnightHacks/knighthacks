import { verifyKey } from "discord-interactions";
import { Next } from "hono";

import { HonoContext } from "~/config";

export async function verifyDiscordRequest(c: HonoContext, next: Next) {
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
