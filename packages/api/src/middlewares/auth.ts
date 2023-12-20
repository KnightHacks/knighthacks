import type { Next } from "hono";
import { createClient } from "@supabase/supabase-js";

import type { HonoContext } from "~/config";

export const auth = async (c: HonoContext, next: Next) => {
  const authorization = c.req.header("authorization");

  const token = authorization?.split(" ")[1];
  if (!token) {
    return c.text("No token provided", 401);
  }

  const supabase = createClient(
    c.env.SUPABASE_PROJECT_URL,
    c.env.SUPABASE_PROJECT_API_KEY,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error) {
    return c.text(error.message, 401);
  }

  c.set("user", user);

  await next();
};
