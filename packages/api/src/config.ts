/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { R2Bucket } from "@cloudflare/workers-types";
import type { Context } from "hono";

export type Bindings = {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  KNIGHT_HACKS_BUCKET: R2Bucket;
};

export type HonoConfig = {
  Bindings: Bindings;
};

export type HonoContext = Context<HonoConfig>;
