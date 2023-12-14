import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers";
import { cors } from "hono/cors";
import { createContext } from "./context";
import { R2PutOptions, type R2Bucket } from "@cloudflare/workers-types";

export type Bindings = {
  DATABASE_URL: string;
  GITHUBID: string;
  GITHUB_SECRET: string;
  SUPABASE_JWT_SECRET: string;
  KNIGHT_HACKS_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello world");
});

app.use("/trpc/*", async (c, next) => {
  const middleware = trpcServer({
    router: appRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: createContext(c.env),
  });
  return await middleware(c, next);
});

// Resume upload
app.put("/upload/:key", async (c) => {
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

  return c.text(`Uploaded ${newFilename} successfully!`);
});

export { app };
