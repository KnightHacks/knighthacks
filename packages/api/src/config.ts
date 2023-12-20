import type { R2Bucket } from "@cloudflare/workers-types";
import type { User } from "@supabase/supabase-js";
import type { Context } from "hono";

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type Bindings = {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  SUPABASE_JWT_SECRET: string;
  SUPABASE_PROJECT_URL: string;
  SUPABASE_PROJECT_API_KEY: string;
  KNIGHT_HACKS_BUCKET: R2Bucket;
};

export type Variables = {
  user: User | null;
};

export type HonoConfig = {
  Bindings: Bindings;
  Variables: Variables;
};

export type HonoContext = Context<HonoConfig>;
