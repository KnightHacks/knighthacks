import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: ["./src/schemas/hackathon.ts", "./src/schemas/socials.ts"],
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
