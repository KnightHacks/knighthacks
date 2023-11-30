import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  out: "./drizzle",
  schema: ["./schemas/schema.ts"],
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    password: process.env.DATABASE_PASSWORD!,
    user: process.env.DATABASE_USERNAME!,
    database: process.env.DATABASE_NAME!,
  },
});
