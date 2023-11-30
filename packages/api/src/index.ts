import { app } from "./app";

console.log("🚀 Starting server...");
await app.listen({ port: 8080, host: "0.0.0.0" });
console.log("🚀 Server ready at: http://localhost:8080/");
