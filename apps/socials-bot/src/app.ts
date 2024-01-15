// I hate Discord's typings

import type { Next } from "hono";
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import { Hono } from "hono";

import { connect } from "@knighthacks/db";

import type { HonoConfig, HonoContext } from "~/config";
import { signIn } from "./commands/sign-in";
import { verifyDiscordRequest } from "./middlewares/verify-discord-request";
import { helloWorld } from "./routes/hello-world";
import { interaction } from "./routes/interaction";

const app = new Hono<HonoConfig>()
  .route("/", helloWorld)
  .route('/', interaction)
  

export { app };
