import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  out: "./drizzle",
  schema: ["./schemas/schema.ts"],
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
});
