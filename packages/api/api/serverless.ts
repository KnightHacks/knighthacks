"use strict";

// Require the framework
import { fastify } from "fastify";
import routes from "../src/app";

// Instantiate Fastify with some config
const app = fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(routes);

export default async (req: Request, res: Response) => {
  await app.ready();
  app.server.emit("request", req, res);
};
