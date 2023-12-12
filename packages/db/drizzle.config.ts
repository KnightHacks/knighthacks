import { defineConfig } from "drizzle-kit";
import "dotenv/config";

console.log("Hello from drizzle.config.ts");
console.log(process.env.DATABASE_URL);

export default defineConfig({
  out: "./drizzle",
  schema: ["./schemas/schema.ts"],
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
