import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { createContext } from "./context";
import { appRouter } from "./router";
import cors from "@fastify/cors";

const server = fastify({
  maxParamLength: 5000,
  logger: true,
});

server.register(cors);
server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
  logLevel: "trace",
});

server.get("/ping", async () => {
  return "pong\n";
});

(async () => {
  try {
    console.log("🚀 Starting server...");
    await server.listen({ port: 8080, host: "0.0.0.0" });
    console.log("🚀 Server ready at: http://localhost:8080/");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
