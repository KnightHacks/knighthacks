import type { EmailAddressJSON, WebhookEvent } from "@clerk/backend";
import { Hono } from "hono";
import { Webhook } from "svix";

import { eq, users } from "@knighthacks/db";

import type { HonoConfig } from "../config";

export const webhook = new Hono<HonoConfig>().post("/", async (c) => {
  const db = c.get("db");
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
      await db.insert(users).values({
        id: event.data.id,
        firstName: event.data.first_name,
        lastName: event.data.last_name,
        email: getPrimaryEmail(
          event.data.email_addresses,
          event.data.primary_email_address_id,
        ),
      });
      return c.text(`User with id ${event.data.id} created`, 200);
    case "user.updated":
      await db
        .update(users)
        .set({
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          email: getPrimaryEmail(
            event.data.email_addresses,
            event.data.primary_email_address_id,
          ),
        })
        .where(eq(users.id, event.data.id));
      return c.text(`User with id ${event.data.id} deleted`, 200);
    case "user.deleted":
      if (!event.data.deleted) return c.text("User not deleted", 400);
      if (!event.data.id) return c.text("Missing user id", 400);
      await db.delete(users).where(eq(users.id, event.data.id));
      return c.text(`User with id ${event.data.id} deleted`, 200);
    default:
      return c.text("Invalid event type", 400);
  }
});

function getPrimaryEmail(emails: EmailAddressJSON[], primaryEmailId: string) {
  const primaryEmail = emails.find((e) => e.id === primaryEmailId)
    ?.email_address;

  // This in theory should never happen since users need to provide an email address to sign up
  if (!primaryEmail) {
    throw new Error("No primary email found");
  }

  return primaryEmail;
}
