import fastify from "fastify";
import routes from "./app";

const app = fastify({
  logger: true,
});

app.register(routes);

console.log("Starting server...");
await app.listen({ port: 8080, host: "0.0.0.0" });
console.log("Server started!");
