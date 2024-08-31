/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { R2Bucket } from "@cloudflare/workers-types";
import type { buildDatabaseClient } from "@knighthacks/db";
import type { Context, Input } from "hono";

export type Bindings = {
  ENV: string;
  KNIGHT_HACKS_BUCKET: R2Bucket;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  DEV_CLERK_SECRET_KEY: string;
  DEV_CLERK_PUBLISHABLE_KEY: string;
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  DEV_DATABASE_URL: string;
  DEV_DATABASE_AUTH_TOKEN: string;
  RESEND_API_KEY: string;
};

export type Variables = {
  db: ReturnType<typeof buildDatabaseClient>;
  origin: string;
};

export type HonoConfig = {
  Bindings: Bindings;
  Variables: Variables;
};

export type HonoContext<
  P extends string = string,
  I extends Input = Input,
> = Context<HonoConfig, P, I>;

declare global {
  interface CustomJwtSessionClaims {
    id: string;
    email: string;
  }
}
