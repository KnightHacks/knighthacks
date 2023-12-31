import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";

import { eq, users } from "@knighthacks/db";

import type { HonoConfig } from "../config";

export const resume = new Hono<HonoConfig>()
  .put("/upload/:key", async (c) => {
    const key = c.req.param("key");
    const bucket = c.env.KNIGHT_HACKS_BUCKET;
    const body = await c.req.arrayBuffer();

    if (!key) return c.text("No key provided", 400);
    if (!body) return c.text("No body provided", 400);
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
      where: eq(users.email, auth.sessionClaims?.email),
      with: {
        profile: true,
      },
    });

    // If the user doesn't exist or the resume key doesn't match,
    // then the user is unauthorized to download the file
    if (!user?.profile?.resume || user.profile.resume !== key)
      return c.text("Unauthorized", 401);

    const bucket = c.env.KNIGHT_HACKS_BUCKET;

    if (!key) return c.text("No key provided", 400);

    // Get the file from the bucket
    const object = await bucket.get(key);
    if (!object) return c.text("File not found", 404);

    const file = await object.arrayBuffer();
    const contentType = object.httpMetadata?.contentType ?? "";

    return c.body(file, {
      headers: {
        "Content-Type": contentType,
      },
    });
  });
