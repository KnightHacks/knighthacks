import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import {
  type DoneFuncWithErrOrRes,
  type FastifyInstance,
  type FastifyServerOptions,
} from "fastify";
import { createContext } from "./context";
import { appRouter } from "./router";
import cors from "@fastify/cors";

export default function app(
  fastify: FastifyInstance,
  options: FastifyServerOptions,
  done: (err?: Error) => void
) {
  fastify.register(cors);
  fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: appRouter, createContext },
    logLevel: "trace",
  });

  fastify.get("/ping", async () => {
    return "pong\n";
  });

  fastify.get("/", async () => {
    return { hello: "world" };
  });

  done();
}
