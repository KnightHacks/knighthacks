import { connect } from "@planetscale/database";
import * as schema from "./schemas";
import { drizzle } from "drizzle-orm/planetscale-serverless";

const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

export const db = drizzle(connection, { schema });
