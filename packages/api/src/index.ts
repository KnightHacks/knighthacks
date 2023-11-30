import fastify from "fastify";

const app = fastify({
  logger: true,
});

app.register(async (fastify, options, done) => {
  await import("./app");
  done();
});

console.log("Starting server...");
await app.listen({ port: 3000, host: "0.0.0.0" });
console.log("Server started!");
