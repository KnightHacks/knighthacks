import { getAuth } from "@hono/clerk-auth";
import { eq } from "@knighthacks/db";
import { users } from "@knighthacks/db/schema";
import { Hono } from "hono";

import type { HonoConfig } from "../config";

export const resume = new Hono<HonoConfig>()
  .put("/upload/:key", async (c) => {
    const key = c.req.param("key");
    const bucket = c.env.KNIGHT_HACKS_BUCKET;
    const body = await c.req.arrayBuffer();

    if (!key) return c.text("No key provided", 400);
    if (!key.endsWith(".pdf")) return c.text("Invalid file type", 400);

    // Format a timestamp for the filename
    const timestamp = new Date().toISOString().replaceAll(/[.:TZ-]/g, "");

    // Create a new filename with the timestamp appended
    const [fileName, fileExtension] = key.split(".");
    const newFilename = `${fileName}-${timestamp}.${fileExtension}`;

    // Upload the file to the bucket
    await bucket.put(newFilename, body);

    return c.json({
      key: newFilename,
    });
  })
  .get("/download/:key", async (c) => {
    const key = c.req.param("key");
    const db = c.get("db");
    const auth = getAuth(c);

    // If the user isn't authenticated, then they're unauthorized
    if (!auth?.sessionClaims) return c.text("Unauthorized", 401);

    // Get user from session
    const user = await db.query.users.findFirst({
      where: eq(users.clerkID, auth.sessionClaims.id),
      with: {
        profile: true,
      },
    });

    if (!user) return c.text("Unauthorized", 401);

    // Check if the user's resume matches the key and if they're an admin
    if (
      key !== user.profile.resume &&
      !user.email.endsWith("@knighthacks.org")
    ) {
      return c.text("Unauthorized", 401);
    }

    const bucket = c.env.KNIGHT_HACKS_BUCKET;

    if (!key) return c.text("No key provided", 400);

    // Get the file from the bucket
    const object = await bucket.get(key);
    if (!object) return c.text("File not found", 404);

    const file = await object.arrayBuffer();

    return c.body(file, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  });
