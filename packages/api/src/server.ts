import { app } from "./app";
import { serve } from "@hono/node-server";

const PORT = 8080;

console.log("Starting server...");
serve({
  fetch: app.fetch,
  port: PORT,
});
console.log(`Server started on port ${PORT}.`);
