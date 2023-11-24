import { defineConfig } from "drizzle-kit";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: ["./schemas/schema.ts"],
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
});
