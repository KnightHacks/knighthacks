import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { createContext } from "./context";
import { appRouter } from "./router";
import cors from "@fastify/cors";

const app = fastify({
  maxParamLength: 5000,
  logger: true,
});

app.register(cors);
app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
  logLevel: "trace",
});

app.get("/ping", async () => {
  return "pong\n";
});

export { app };
