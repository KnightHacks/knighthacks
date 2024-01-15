import { Hono } from "hono";

import { HonoConfig } from "~/config";

export const helloWorld = new Hono<HonoConfig>().get("/", (c) => {
  return c.json({
    message: "Hello, world!",
  });
});
