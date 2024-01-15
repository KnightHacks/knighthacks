/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { Context, Input } from "hono";

import type { connect } from "@knighthacks/db";

export type Bindings = {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_ADMIN_ROLE_ID: string;
};

export type Variables = {
  db: ReturnType<typeof connect>;
  interaction: any; // TODO: type this
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
