import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers";
import { cors } from "hono/cors";
import { createTRPCContextFromHonoContext } from "./context";
import { type R2Bucket } from "@cloudflare/workers-types";
import { verify, jwt } from "hono/jwt";

export type Bindings = {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  SUPABASE_JWT_SECRET: string;
  KNIGHT_HACKS_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello world");
});

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Get user session from authorization header and pass it to TRPC
app.use("/trpc/*", async (c, next) => {
  const authorization = c.req.header("authorization");

  const token = authorization?.split(" ")[1];
  if (!token) {
    return await next();
  }

  const decoded = await verify(token, c.env.SUPABASE_JWT_SECRET);
  if (!decoded) {
    return await next();
  }

  c.set("jwtPayload", decoded);
  await next();
});

app.use("/trpc/*", async (c, next) => {
  const trpcMiddleware = trpcServer({
    router: appRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: createTRPCContextFromHonoContext(c),
  });
  return await trpcMiddleware(c, next);
});

app.use("/resume/*", (c, next) => {
  return jwt({ secret: c.env.SUPABASE_JWT_SECRET })(c, next);
});

// Resume upload
app.put("/resume/upload/:key", async (c) => {
  const key = c.req.param("key");
  const bucket = c.env.KNIGHT_HACKS_BUCKET;
  const body = await c.req.arrayBuffer();

  if (!key) return c.text("No key provided", 400);
  if (!body) return c.text("No body provided", 400);
  if (!key.endsWith(".pdf")) return c.text("Invalid file type", 400);

  // Format a timestamp for the filename
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");

  // Create a new filename with the timestamp appended
  const [fileName, fileExtension] = key.split(".");
  const newFilename = `${fileName}-${timestamp}.${fileExtension}`;

  // Upload the file to the bucket
  await bucket.put(newFilename, body);

  return c.json({
    success: true,
    key: newFilename,
  });
});

// Resume download
app.get("/resume/download/:key", async (c) => {
  const key = c.req.param("key");
  const bucket = c.env.KNIGHT_HACKS_BUCKET;

  if (!key) return c.text("No key provided", 400);

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

export { app };
