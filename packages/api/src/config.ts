/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { R2Bucket } from "@cloudflare/workers-types";
import type { Context, Input } from "hono";

import type { connect } from "@knighthacks/db";

export type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_WEBHOOK_SECRET_KEY: string;
  KNIGHT_HACKS_BUCKET: R2Bucket;
};

export type Variables = {
  db: ReturnType<typeof connect>;
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
