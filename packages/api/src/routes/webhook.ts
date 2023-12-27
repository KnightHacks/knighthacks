import type { WebhookEvent } from "@clerk/backend";
import { Hono } from "hono";
import { Webhook } from "svix";

import type { HonoConfig } from "../config";

export const webhook = new Hono<HonoConfig>().post("/", async (c) => {
  const payload = await c.req.text();
  const id = c.req.header("svix-id");
  const timestamp = c.req.header("svix-timestamp");
  const signature = c.req.header("svix-signature");

  if (!id || !timestamp || !signature) {
    return c.text("Missing svix headers", 400);
  }

  const webhook = new Webhook(c.env.CLERK_WEBHOOK_SECRET_KEY);
  const event = webhook.verify(payload, {
    "svix-id": id,
    "svix-timestamp": timestamp,
    "svix-signature": signature,
  }) as WebhookEvent;

  switch (event.type) {
    case "user.created":
      break;
    case "user.updated":
      break;
    case "user.deleted":
      break;
  }

  return c.text("ok", 200);
});
