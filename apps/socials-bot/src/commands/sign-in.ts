import { connect } from "@knighthacks/db";

import { HonoContext } from "~/config";
import { isAdmin } from "../utils";

export async function signIn(
  c: HonoContext,
  interaction: any,
  db: ReturnType<typeof connect>,
) {}
