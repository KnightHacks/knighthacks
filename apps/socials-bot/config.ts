/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { InteractionType } from "discord-interactions";
import type { Context, Input } from "hono";

import type { connect } from "@knighthacks/db";

export type Bindings = {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_PUBLIC_KEY: string;
};

export interface Interaction {
  [key: string]: unknown;
  type: InteractionType;
  data: {
    [key: string]: unknown;
    name: string;
  };
}

export type Variables = {
  db: ReturnType<typeof connect>;
  interaction: Interaction;
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
