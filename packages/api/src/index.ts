import fastify from "fastify";

const app = fastify({
  logger: true,
});

app.register(import("./app.ts"));

console.log("Starting server...");
await app.listen({ port: 8080, host: "0.0.0.0" });
console.log("Server started!");
