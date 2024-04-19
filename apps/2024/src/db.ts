import { connect } from "@knighthacks/db";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = connect(
  process.env.DATABASE_URL,
  process.env.DATABASE_AUTH_TOKEN,
);
